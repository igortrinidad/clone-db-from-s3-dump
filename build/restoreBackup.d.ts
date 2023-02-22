interface RestoreBackupInputInterface {
    DOCKER_CONTAINER?: string;
    DB_NAME?: string;
    S3_FOLDER?: string;
    S3_REGION?: string;
    S3_BUCKET?: string;
}
export declare const restoreBackup: ({ DOCKER_CONTAINER, DB_NAME, S3_FOLDER, S3_REGION, S3_BUCKET }?: RestoreBackupInputInterface) => Promise<void>;
export {};
