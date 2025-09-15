import {Injectable} from '@nestjs/common';
import * as crypto from 'crypto';
import {verifyRegistrationResponse, verifyAuthenticationResponse} from '@simplewebauthn/server';
import base64url from 'base64url';

// 定义凭证数据结构，用于存储用户的公钥凭证
interface Credential {
    id: string;                     // 凭证唯一标识符
    publicKey: string;             // 公钥，用于验证签名
    counter: number;               // 计数器，防止重放攻击
    transports?: string[];          // 支持的传输方式（如 USB、NFC 等）
}

// 内存存储，用于保存用户的凭证信息（生产环境应使用数据库）
const inMemoryStore: Record<string, Credential[]> = {};

@Injectable()
export class AppService {
    /**
     * 生成注册挑战码
     * @param body 请求体，包含用户账户信息
     * @param req 请求对象，用于存储会话信息
     * @returns 包含挑战码和用户ID的响应
     */
    getRegisterChallenge(body, req: any) {
        const {account} = body
        // 生成随机挑战码，用于防止重放攻击
        const challenge = crypto.randomBytes(32).toString('base64url');
        // 将用户账户转换为Base64URL格式的用户ID
        const userId = Buffer.from(account).toString("base64url");
        // 将挑战码和用户ID存储在会话中，用于后续验证
        req.session.challenge = challenge;
        req.session.userId = userId
        return {
            challenge,
            userId,
        };
    }

    /**
     * 生成登录挑战码
     * @param body 请求体，包含用户账户信息
     * @param req 请求对象，用于存储会话信息
     * @returns 包含挑战码、允许的凭证列表和用户ID的响应
     */
    getLoginChallenge(body: any, req) {
        const {account} = body
        // 将用户账户转换为Base64URL格式的用户ID
        const userId = Buffer.from(account).toString("base64url");
        // 查找该用户已注册的凭证
        const credentials = inMemoryStore[userId];
        console.log(credentials)
        if (!credentials || credentials.length === 0) {
            throw new Error("用户未注册或没有凭证");
        }
        // 生成随机挑战码
        const challenge = crypto.randomBytes(32).toString("base64url");
        // 将挑战码和用户ID存储在会话中
        req.session.challenge = challenge;
        req.session.userId = userId;
        return {
            challenge,
            // 构建允许的凭证列表，限制只能使用已注册的凭证
            allowCredentials: credentials.map((cred) => ({
                id: cred.id,
                type: "public-key",
                transports: cred.transports || ["internal"],
            })),
            userId,
        };
    }

    /**
     * 验证注册响应并保存凭证
     * @param credential 凭证响应数据
     * @param req 请求对象，包含会话信息
     * @returns 验证结果
     */
    async getRegisterResponse(credential: any, req: any) {
        // 从会话中获取预期的挑战码和用户ID
        const expectedChallenge = req.session.challenge;
        const userId = req.session.userId

        // 验证注册响应
        const verification = await verifyRegistrationResponse({
            response: credential as any,
            expectedChallenge,
            expectedOrigin: 'http://localhost:3001',
            expectedRPID: 'localhost',
        });
        const {verified, registrationInfo} = verification;

        // 如果验证成功，保存凭证信息
        if (verified && registrationInfo) {
            const userCred = registrationInfo.credential;
            // 初始化用户的凭证存储空间
            if (!inMemoryStore[userId]) inMemoryStore[userId] = [];
            // 保存凭证信息
            inMemoryStore[userId].push({
                id: userCred.id,
                publicKey: base64url(Buffer.from(userCred.publicKey)),
                counter: userCred.counter,
                transports: userCred.transports || [],
            });

            return {ok: true};
        } else {
            return {ok: false, error: 'Registration verification failed'};
        }
    }

    /**
     * 验证登录响应
     * @param credential 认证凭证数据
     * @param req 请求对象，包含会话信息
     * @returns 验证结果
     */
    async getLoginResponse(credential: any, req: any) {
        // 从会话中获取预期的挑战码和用户ID
        const expectedChallenge = req.session.challenge;
        const userId = req.session.userId

        // 查找用户的凭证信息
        const userCreds = inMemoryStore[userId];
        if (!userCreds) {
            throw new Error('用户未注册');
        }
        // 查找匹配的凭证
        const dbCred = userCreds.find(c => c.id === credential.id);
        if (!dbCred) {
            throw new Error('未找到该 credential');
        }

        // 验证认证响应
        const verification = await verifyAuthenticationResponse({
            response: credential,
            expectedChallenge,
            expectedOrigin: 'http://localhost:3001',
            expectedRPID: 'localhost',
            credential: {
                id: dbCred.id,
                publicKey: base64url.toBuffer(dbCred.publicKey),
                counter: dbCred.counter,
                transports: [],
            },
        });
        const {verified, authenticationInfo} = verification;

        // 如果验证成功，更新计数器
        if (verified) {
            // 更新 counter，防止重放攻击
            dbCred.counter = authenticationInfo.newCounter;
            return {ok: true};
        } else {
            return {ok: false, error: 'Authentication verification failed'};
        }

    }


}
