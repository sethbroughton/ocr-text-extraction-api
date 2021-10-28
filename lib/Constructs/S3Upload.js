"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Upload = void 0;
const cdk = require("@aws-cdk/core");
const iam = require("@aws-cdk/aws-iam");
const cognito = require("@aws-cdk/aws-cognito");
const aws_cognito_1 = require("@aws-cdk/aws-cognito");
class S3Upload extends cdk.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const uploadBucket = props.Bucket;
        const identityPool = new aws_cognito_1.CfnIdentityPool(this, 'Ocr-extract-api-IdentityPool', {
            allowUnauthenticatedIdentities: true,
        });
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
        };
        const customPolicyDocument = iam.PolicyDocument.fromJson(unAuthPolicyDocument);
        unauthenticatedRole.attachInlinePolicy(new iam.Policy(this, 'UnAuthPolicy', {
            document: customPolicyDocument
        }));
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
                        `arn:aws:s3:::${uploadBucket.bucketName}/protected/` + "${cognito-identity.amazonaws.com:sub}/*",
                        `arn:aws:s3:::${uploadBucket.bucketName}/private/` + "${cognito-identity.amazonaws.com:sub}/*"
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
        };
        const customPolicyDocumentAuth = iam.PolicyDocument.fromJson(AuthPolicyDocument);
        const authenticatedRole = new iam.Role(this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                "StringEquals": { "cognito-identity.amazonaws.com:aud": identityPool.ref },
                "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "authenticated" },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        authenticatedRole.attachInlinePolicy(new iam.Policy(this, 'AuthPolicy', {
            document: customPolicyDocumentAuth
        }));
        new cognito.CfnIdentityPoolRoleAttachment(this, 'roleattachement', {
            identityPoolId: identityPool.ref,
            roles: {
                authenticated: authenticatedRole.roleArn,
                unauthenticated: unauthenticatedRole.roleArn
            },
        });
    }
}
exports.S3Upload = S3Upload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUzNVcGxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTM1VwbG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFFckMsd0NBQXdDO0FBQ3hDLGdEQUFnRDtBQUNoRCxzREFBdUQ7QUFNdkQsTUFBYSxRQUFTLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFDdkMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFvQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFbEMsTUFBTSxZQUFZLEdBQUcsSUFBSSw2QkFBZSxDQUFDLElBQUksRUFBRSw4QkFBOEIsRUFBRTtZQUMzRSw4QkFBOEIsRUFBRSxJQUFJO1NBQ3ZDLENBQUMsQ0FBQTtRQUVGLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxtQ0FBbUMsRUFBRTtZQUNoRixTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ3BFLGNBQWMsRUFBRSxFQUFFLG9DQUFvQyxFQUFFLFlBQVksQ0FBQyxHQUFHLEVBQUU7Z0JBQzFFLHdCQUF3QixFQUFFLEVBQUUsb0NBQW9DLEVBQUUsaUJBQWlCLEVBQUU7YUFDeEYsRUFBRSwrQkFBK0IsQ0FBQztTQUN0QyxDQUFDLENBQUM7UUFFSCxNQUFNLG9CQUFvQixHQUFHO1lBQ3pCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLFdBQVcsRUFBRTtnQkFDVDtvQkFDSSxRQUFRLEVBQUU7d0JBQ04sY0FBYzt3QkFDZCxjQUFjO3dCQUNkLGlCQUFpQjtxQkFDcEI7b0JBQ0QsVUFBVSxFQUFFO3dCQUNSLGdCQUFnQixZQUFZLENBQUMsVUFBVSxXQUFXO3FCQUNyRDtvQkFDRCxRQUFRLEVBQUUsT0FBTztpQkFDcEI7Z0JBQ0Q7b0JBQ0ksUUFBUSxFQUFF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LENBQUM7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDcEUsUUFBUSxFQUFFLHdCQUF3QjtTQUNyQyxDQUFDLENBQUMsQ0FBQTtRQUdILElBQUksT0FBTyxDQUFDLDZCQUE2QixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUMvRCxjQUFjLEVBQUUsWUFBWSxDQUFDLEdBQUc7WUFDaEMsS0FBSyxFQUFFO2dCQUNILGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxPQUFPO2dCQUN4QyxlQUFlLEVBQUUsbUJBQW1CLENBQUMsT0FBTzthQUMvQztTQUNKLENBQUMsQ0FBQTtJQUdOLENBQUM7Q0FDSjtBQS9KRCw0QkErSkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XHJcbmltcG9ydCB7IElCdWNrZXQgfSBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xyXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XHJcbmltcG9ydCAqIGFzIGNvZ25pdG8gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZ25pdG8nO1xyXG5pbXBvcnQgeyBDZm5JZGVudGl0eVBvb2wgfSBmcm9tICdAYXdzLWNkay9hd3MtY29nbml0byc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFMzVXBsb2FkUHJvcHMge1xyXG4gICAgQnVja2V0OiBJQnVja2V0XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTM1VwbG9hZCBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTM1VwbG9hZFByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXBsb2FkQnVja2V0ID0gcHJvcHMuQnVja2V0O1xyXG5cclxuICAgICAgICBjb25zdCBpZGVudGl0eVBvb2wgPSBuZXcgQ2ZuSWRlbnRpdHlQb29sKHRoaXMsICdPY3ItZXh0cmFjdC1hcGktSWRlbnRpdHlQb29sJywge1xyXG4gICAgICAgICAgICBhbGxvd1VuYXV0aGVudGljYXRlZElkZW50aXRpZXM6IHRydWUsXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgY29uc3QgdW5hdXRoZW50aWNhdGVkUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQ29nbml0b0RlZmF1bHRVbmF1dGhlbnRpY2F0ZWRSb2xlJywge1xyXG4gICAgICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uRmVkZXJhdGVkUHJpbmNpcGFsKCdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20nLCB7XHJcbiAgICAgICAgICAgICAgICBcIlN0cmluZ0VxdWFsc1wiOiB7IFwiY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOmF1ZFwiOiBpZGVudGl0eVBvb2wucmVmIH0sXHJcbiAgICAgICAgICAgICAgICBcIkZvckFueVZhbHVlOlN0cmluZ0xpa2VcIjogeyBcImNvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphbXJcIjogXCJ1bmF1dGhlbnRpY2F0ZWRcIiB9LFxyXG4gICAgICAgICAgICB9LCBcInN0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5XCIpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB1bkF1dGhQb2xpY3lEb2N1bWVudCA9IHtcclxuICAgICAgICAgICAgXCJWZXJzaW9uXCI6IFwiMjAxMi0xMC0xN1wiLFxyXG4gICAgICAgICAgICBcIlN0YXRlbWVudFwiOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJBY3Rpb25cIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInMzOkdldE9iamVjdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInMzOlB1dE9iamVjdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInMzOkRlbGV0ZU9iamVjdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBcIlJlc291cmNlXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYGFybjphd3M6czM6Ojoke3VwbG9hZEJ1Y2tldC5idWNrZXROYW1lfS9wdWJsaWMvKmBcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRWZmZWN0XCI6IFwiQWxsb3dcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcIkFjdGlvblwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiczM6UHV0T2JqZWN0XCJcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiUmVzb3VyY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBgYXJuOmF3czpzMzo6OiR7dXBsb2FkQnVja2V0LmJ1Y2tldE5hbWV9L3VwbG9hZHMvKmBcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRWZmZWN0XCI6IFwiQWxsb3dcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcIkFjdGlvblwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiczM6R2V0T2JqZWN0XCJcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiUmVzb3VyY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBgYXJuOmF3czpzMzo6OiR7dXBsb2FkQnVja2V0LmJ1Y2tldE5hbWV9L3Byb3RlY3RlZC8qYFxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29uZGl0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJTdHJpbmdMaWtlXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiczM6cHJlZml4XCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInB1YmxpYy9cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInB1YmxpYy8qXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm90ZWN0ZWQvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm90ZWN0ZWQvKlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQWN0aW9uXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzMzpMaXN0QnVja2V0XCJcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiUmVzb3VyY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBgYXJuOmF3czpzMzo6OiR7dXBsb2FkQnVja2V0LmJ1Y2tldE5hbWV9YFxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGN1c3RvbVBvbGljeURvY3VtZW50ID0gaWFtLlBvbGljeURvY3VtZW50LmZyb21Kc29uKHVuQXV0aFBvbGljeURvY3VtZW50KTtcclxuXHJcbiAgICAgICAgdW5hdXRoZW50aWNhdGVkUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kobmV3IGlhbS5Qb2xpY3kodGhpcywgJ1VuQXV0aFBvbGljeScsIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQ6IGN1c3RvbVBvbGljeURvY3VtZW50XHJcbiAgICAgICAgfSkpXHJcblxyXG4gICAgICAgIGNvbnN0IEF1dGhQb2xpY3lEb2N1bWVudCA9IHtcclxuICAgICAgICAgICAgXCJWZXJzaW9uXCI6IFwiMjAxMi0xMC0xN1wiLFxyXG4gICAgICAgICAgICBcIlN0YXRlbWVudFwiOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJBY3Rpb25cIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInMzOkdldE9iamVjdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInMzOlB1dE9iamVjdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInMzOkRlbGV0ZU9iamVjdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBcIlJlc291cmNlXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYGFybjphd3M6czM6Ojoke3VwbG9hZEJ1Y2tldC5idWNrZXROYW1lfS9wdWJsaWMvKmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6JHt1cGxvYWRCdWNrZXQuYnVja2V0TmFtZX0vcHJvdGVjdGVkL2ArXCIke2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTpzdWJ9LypcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYGFybjphd3M6czM6Ojoke3VwbG9hZEJ1Y2tldC5idWNrZXROYW1lfS9wcml2YXRlL2ArXCIke2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTpzdWJ9LypcIlxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQWN0aW9uXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzMzpQdXRPYmplY3RcIlxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJSZXNvdXJjZVwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6JHt1cGxvYWRCdWNrZXQuYnVja2V0TmFtZX0vdXBsb2Fkcy8qYFxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQWN0aW9uXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzMzpHZXRPYmplY3RcIlxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJSZXNvdXJjZVwiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6JHt1cGxvYWRCdWNrZXQuYnVja2V0TmFtZX0vcHJvdGVjdGVkLypgXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb25kaXRpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlN0cmluZ0xpa2VcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzMzpwcmVmaXhcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHVibGljL1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHVibGljLypcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInByb3RlY3RlZC9cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInByb3RlY3RlZC8qXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcml2YXRlLyR7Y29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOnN1Yn0vXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcml2YXRlLyR7Y29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOnN1Yn0vKlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQWN0aW9uXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzMzpMaXN0QnVja2V0XCJcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiUmVzb3VyY2VcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBgYXJuOmF3czpzMzo6OiR7dXBsb2FkQnVja2V0LmJ1Y2tldE5hbWV9YFxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGN1c3RvbVBvbGljeURvY3VtZW50QXV0aCA9IGlhbS5Qb2xpY3lEb2N1bWVudC5mcm9tSnNvbihBdXRoUG9saWN5RG9jdW1lbnQpO1xyXG5cclxuICAgICAgICBjb25zdCBhdXRoZW50aWNhdGVkUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQ29nbml0b0RlZmF1bHRBdXRoZW50aWNhdGVkUm9sZScsIHtcclxuICAgICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkZlZGVyYXRlZFByaW5jaXBhbCgnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tJywge1xyXG4gICAgICAgICAgICAgICAgXCJTdHJpbmdFcXVhbHNcIjogeyBcImNvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphdWRcIjogaWRlbnRpdHlQb29sLnJlZiB9LFxyXG4gICAgICAgICAgICAgICAgXCJGb3JBbnlWYWx1ZTpTdHJpbmdMaWtlXCI6IHsgXCJjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206YW1yXCI6IFwiYXV0aGVudGljYXRlZFwiIH0sXHJcbiAgICAgICAgICAgIH0sIFwic3RzOkFzc3VtZVJvbGVXaXRoV2ViSWRlbnRpdHlcIiksXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGF1dGhlbnRpY2F0ZWRSb2xlLmF0dGFjaElubGluZVBvbGljeShuZXcgaWFtLlBvbGljeSh0aGlzLCAnQXV0aFBvbGljeScsIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQ6IGN1c3RvbVBvbGljeURvY3VtZW50QXV0aFxyXG4gICAgICAgIH0pKVxyXG5cclxuXHJcbiAgICAgICAgbmV3IGNvZ25pdG8uQ2ZuSWRlbnRpdHlQb29sUm9sZUF0dGFjaG1lbnQodGhpcywgJ3JvbGVhdHRhY2hlbWVudCcsIHtcclxuICAgICAgICAgICAgaWRlbnRpdHlQb29sSWQ6IGlkZW50aXR5UG9vbC5yZWYsXHJcbiAgICAgICAgICAgIHJvbGVzOiB7XHJcbiAgICAgICAgICAgICAgICBhdXRoZW50aWNhdGVkOiBhdXRoZW50aWNhdGVkUm9sZS5yb2xlQXJuLFxyXG4gICAgICAgICAgICAgICAgdW5hdXRoZW50aWNhdGVkOiB1bmF1dGhlbnRpY2F0ZWRSb2xlLnJvbGVBcm5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==