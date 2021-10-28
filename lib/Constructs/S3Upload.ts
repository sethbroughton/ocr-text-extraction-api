import * as cdk from '@aws-cdk/core';
import { IBucket } from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';
import { CfnIdentityPool } from '@aws-cdk/aws-cognito';

export interface S3UploadProps {
    Bucket: IBucket
}

export class S3Upload extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: S3UploadProps) {
        super(scope, id);

        const uploadBucket = props.Bucket;

        const identityPool = new CfnIdentityPool(this, 'Ocr-extract-api-IdentityPool', {
            allowUnauthenticatedIdentities: true,
        })

        const unauthenticatedRole = new iam.Role(this, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "unauthenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });

        const unAuthPolicyDocument = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": [
                        "s3:GetObject",
                        "s3:PutObject",
                        "s3:DeleteObject"
                    ],
                    "Resource": [
                        `arn:aws:s3:::${uploadBucket.bucketName}/public/*`
                    ],
                    "Effect": "Allow"
                },
                {
                    "Action": [
                        "s3:PutObject"
                    ],
                    "Resource": [
                        `arn:aws:s3:::${uploadBucket.bucketName}/uploads/*`
                    ],
                    "Effect": "Allow"
                },
                {
                    "Action": [
                        "s3:GetObject"
                    ],
                    "Resource": [
                        `arn:aws:s3:::${uploadBucket.bucketName}/protected/*`
                    ],
                    "Effect": "Allow"
                },
                {
                    "Condition": {
                        "StringLike": {
                            "s3:prefix": [
                                "public/",
                                "public/*",
                                "protected/",
                                "protected/*"
                            ]
                        }
                    },
                    "Action": [
                        "s3:ListBucket"
                    ],
                    "Resource": [
                        `arn:aws:s3:::${uploadBucket.bucketName}`
                    ],
                    "Effect": "Allow"
                }
            ]
        }

        const customPolicyDocument = iam.PolicyDocument.fromJson(unAuthPolicyDocument);

        unauthenticatedRole.attachInlinePolicy(new iam.Policy(this, 'UnAuthPolicy', {
            document: customPolicyDocument
        }))

        const AuthPolicyDocument = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": [
                        "s3:GetObject",
                        "s3:PutObject",
                        "s3:DeleteObject"
                    ],
                    "Resource": [
                        `arn:aws:s3:::${uploadBucket.bucketName}/public/*`,
                        `arn:aws:s3:::${uploadBucket.bucketName}/protected/`+"${cognito-identity.amazonaws.com:sub}/*",
                        `arn:aws:s3:::${uploadBucket.bucketName}/private/`+"${cognito-identity.amazonaws.com:sub}/*"
                    ],
                    "Effect": "Allow"
                },
                {
                    "Action": [
                        "s3:PutObject"
                    ],
                    "Resource": [
                        `arn:aws:s3:::${uploadBucket.bucketName}/uploads/*`
                    ],
                    "Effect": "Allow"
                },
                {
                    "Action": [
                        "s3:GetObject"
                    ],
                    "Resource": [
                        `arn:aws:s3:::${uploadBucket.bucketName}/protected/*`
                    ],
                    "Effect": "Allow"
                },
                {
                    "Condition": {
                        "StringLike": {
                            "s3:prefix": [
                                "public/",
                                "public/*",
                                "protected/",
                                "protected/*",
                                "private/${cognito-identity.amazonaws.com:sub}/",
                                "private/${cognito-identity.amazonaws.com:sub}/*"
                            ]
                        }
                    },
                    "Action": [
                        "s3:ListBucket"
                    ],
                    "Resource": [
                        `arn:aws:s3:::${uploadBucket.bucketName}`
                    ],
                    "Effect": "Allow"
                }
            ]
        }

        const customPolicyDocumentAuth = iam.PolicyDocument.fromJson(AuthPolicyDocument);

        const authenticatedRole = new iam.Role(this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "authenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });

        authenticatedRole.attachInlinePolicy(new iam.Policy(this, 'AuthPolicy', {
            document: customPolicyDocumentAuth
        }))


        new cognito.CfnIdentityPoolRoleAttachment(this, 'roleattachement', {
            identityPoolId: identityPool.ref,
            roles: {
                authenticated: authenticatedRole.roleArn,
                unauthenticated: unauthenticatedRole.roleArn
            },
        })


    }
}

