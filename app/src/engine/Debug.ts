import Engine3D from "./Engine3D";

class Debug {
    
    private static LogWrapper(content: string, extra: string|null = null, subject: string|null = null, reasonMSG: string|null = null): string {
        const line = '-'.repeat(30);
        return `
        ${Engine3D.NAME}${(!extra) ? "" : `: [ ${extra} ]`}
        ${line}
        ${(!subject) ? "" : `    [${subject}]:`} ${content} 
        ${(!reasonMSG) ? "" : `    [Reason]: ${reasonMSG}`}
        ${line}
        `
    }

    public static Log(msg: string): void {
        console.log(this.LogWrapper(msg));
    }

    public static LogWarning(msg: string, subject: string|null = null, reasonMSG: string|null = null): void {
        console.warn(this.LogWrapper(msg, "Warning", subject, reasonMSG));
    }

    public static LogError(msg: string, subject: string|null = null, reasonMSG: string|null = null): void {
        console.error(this.LogWrapper(msg, "Error",subject, reasonMSG));
    }
}

export default Debug;