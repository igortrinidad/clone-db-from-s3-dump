import { S3Client } from '@aws-sdk/client-s3';
interface AwsS3ServiceConstructorInput {
    S3_REGION: string;
    S3_BUCKET: string;
}
export declare const AwsS3Service: {
    new ({ S3_REGION, S3_BUCKET }: AwsS3ServiceConstructorInput): {
        Bucket: string;
        _s3: S3Client;
        listAwsObjects(path: string): Promise<Array<string>>;
        getObjectAndSaveLocally({ key, localFilePath }: {
            key: string;
            localFilePath: string;
        }): Promise<any>;
    };
};
export {};
