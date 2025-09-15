import {cn} from "@/lib/utils"
import {useState} from "react";
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

const LoginForm: React.FC<any> = ({isRegister, onLogin, onRegister}) => {
    const [value, setValue] = useState("");

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader>
                    <CardTitle>WebAuthn 认证</CardTitle>
                    <CardDescription>
                        输入账号，然后使用指纹 / FaceID / 安全密钥完成登录
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="email">账号</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="请输入账号名称"
                                autoComplete="off"
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value)
                                }}
                            />
                        </div>
                        <div className="flex  gap-3">
                            <Button type="submit" className="flex-1 cursor-pointer" disabled={!isRegister}
                                    onClick={() => {
                                        if (isRegister) {
                                            onLogin(value)
                                        }
                                    }}>
                                登录
                            </Button>
                            <Button variant="outline" disabled={!value} className="flex-1 cursor-pointer"
                                    onClick={() => onRegister(value)}>
                                注册
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

}

export default LoginForm;
