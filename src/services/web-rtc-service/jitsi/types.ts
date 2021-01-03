export interface JitsiOptions {
    roomName: string
    width?: number | string | null
    height?: number | string | null
    configOverwrite?: object | null
    interfaceConfigOverwrite?: object | null
    noSSL?: boolean | null
    jwt?: string | null
    onLoad?: () => void
    invitees?: unknown[]
    devices?: {
        audioInput?: string
        audioOutput?: string
        videoInput?: string
    }
    userInfo?: {
        email?: string
        displayName?: string
    }
}