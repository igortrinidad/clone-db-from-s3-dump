interface RestoreBackupInputInterface {
    NODE_ENV?: string;
    DOCKER_CONTAINER?: string;
    DB_NAME?: string;
}
export declare const restoreBackup: ({ NODE_ENV, DOCKER_CONTAINER, DB_NAME }?: RestoreBackupInputInterface) => Promise<void>;
export {};
