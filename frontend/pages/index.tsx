import LoginForm from "@/components/login-form";
import {useState, useEffect} from "react";
import {toast, Toaster} from "sonner"
import {arrayBufferToBase64, base64ToArrayBuffer} from "@/lib/utils";

export default function Home() {
    const [isRegister, setIsRegister] = useState(false);

    /**
     * 处理用户注册点击事件
     * 使用 WebAuthn API 创建新的公钥凭证
     * @param value 用户账户名称
     */
    const handleRegisterClick = async (value: string) => {
        // 向后端请求注册挑战码
        const challengeResp = await fetch('/api/register-challenge', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({account: value}),
        });
        const challenge = await challengeResp.json();
        if (challenge.statusCode === 500) return
        // 使用 WebAuthn API 创建新的凭证
        const credential: any = await navigator.credentials.create({
            publicKey: {
                challenge: base64ToArrayBuffer(challenge.challenge), // 随机挑战，服务端生成，防重放攻击
                rp: {name: "WebAuthn Demo"}, // Relying Party（依赖方）信息，表示你的网站/服务
                user: {
                    id: base64ToArrayBuffer(challenge.userId),
                    name: window.location.origin,
                    displayName: "Demo User",
                }, // 用户信息，表示注册此凭证的用户
                // 支持的公钥算法类型，-7 表示 ES256 算法
                pubKeyCredParams: [{alg: -7, type: "public-key"}],
                // 身份验证器选择条件：要求用户验证且使用平台身份验证器（如 Touch ID、Windows Hello）
                authenticatorSelection: {userVerification: "required", authenticatorAttachment: "platform"},
                timeout: 60000, // 超时时间（毫秒），超时则注册失败。
            },
        });

        // 构建注册响应数据，发送给后端进行验证和存储
        const response = {
            id: credential.id,
            rawId: arrayBufferToBase64(credential.rawId),
            type: credential.type,
            response: {
                // 包含公钥和其他认证器信息的证明对象
                attestationObject: arrayBufferToBase64(credential.response.attestationObject),
                // 包含客户端数据的 JSON 对象
                clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON),
            },
        };

        // 将注册响应发送给后端进行验证和存储
        const verifyResp = await fetch('/api/register-response', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(response),
        });
        const verify = await verifyResp.json();
        if (verify.ok) {
            setIsRegister(verify.ok)
            toast.success("注册成功")
        }
    };

    /**
     * 处理用户登录点击事件
     * 使用 WebAuthn API 进行身份验证
     * @param value 用户账户名称
     */
    const handleLoginClick = async (value: string) => {
        // 向后端请求登录挑战码
        const challengeResp = await fetch('/api/login-challenge', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({account: value}),
        });
        const challenge = await challengeResp.json();
        if (challenge.statusCode === 500) return
        // 使用 WebAuthn API 获取身份验证断言
        const assertion: any = await navigator.credentials.get({
            publicKey: {
                challenge: base64ToArrayBuffer(challenge.challenge),
                // 限制只能使用用户已注册的凭证
                allowCredentials: challenge.allowCredentials.map((c: any) => ({
                    id: base64ToArrayBuffer(c.id),
                    type: c.type,
                })),
                timeout: 60000,
                userVerification: "preferred", // 偏好用户验证，但不强制要求
            },
        });

        // 构建登录响应数据，发送给后端进行验证
        const response = {
            id: assertion.id,
            rawId: arrayBufferToBase64(assertion.rawId),
            type: assertion.type,
            response: {
                // 认证器数据，包含 RP ID、标志位、计数器等信息
                authenticatorData: arrayBufferToBase64(assertion.response.authenticatorData),
                // 客户端数据，包含挑战码、来源等信息
                clientDataJSON: arrayBufferToBase64(assertion.response.clientDataJSON),
                // 认证器对挑战码的签名
                signature: arrayBufferToBase64(assertion.response.signature),
                // 用户句柄，用于标识用户（可选）
                userHandle: assertion.response.userHandle
                    ? arrayBufferToBase64(assertion.response.userHandle)
                    : null,
            },
        };

        // 将登录响应发送给后端进行验证
        const verifyResp = await fetch('/api/login-response', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(response),
        });

        if (verifyResp) {
            toast.success("登陆成功")
        }
    };

    useEffect(() => {
        toast.info("因为是简单示例，请输入账号并注册")
    }, [])

    return (
        <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Toaster position="top-right" richColors/>
            <div className="w-full max-w-sm">
                <LoginForm onRegister={handleRegisterClick} onLogin={handleLoginClick} isRegister={isRegister}/>
            </div>
        </main>
    );
}
