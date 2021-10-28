"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractTextApiStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_lambda_python_1 = require("@aws-cdk/aws-lambda-python");
const lambda = require("@aws-cdk/aws-lambda");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const path = require("path");
const apigateway = require("@aws-cdk/aws-apigatewayv2");
const aws_apigatewayv2_1 = require("@aws-cdk/aws-apigatewayv2");
const aws_apigatewayv2_integrations_1 = require("@aws-cdk/aws-apigatewayv2-integrations");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const aws_lambda_event_sources_1 = require("@aws-cdk/aws-lambda-event-sources");
const S3Upload_1 = require("./Constructs/S3Upload");
class ExtractTextApiStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const al1Layer = new lambda.LayerVersion(this, 'al1-layer', {
            code: aws_lambda_1.Code.fromAsset(path.join(__dirname, '..', 'docker', 'layer')),
            description: 'AL1 Tesseract Layer'
        });
        const imageProcessor = new aws_lambda_python_1.PythonFunction(this, 'Image-Processor', {
            entry: path.join(__dirname, '..', 'image-processor'),
            index: 'image-processor.py',
            runtime: aws_lambda_1.Runtime.PYTHON_3_6,
            layers: [al1Layer],
            memorySize: 1024,
            timeout: cdk.Duration.seconds(10),
        });
        const processImageIntegration = new aws_apigatewayv2_integrations_1.LambdaProxyIntegration({
            handler: imageProcessor
        });
        const api = new apigateway.HttpApi(this, 'OCR-Api-Gateway');
        api.addRoutes({
            path: '/processor',
            methods: [aws_apigatewayv2_1.HttpMethod.POST],
            integration: processImageIntegration
        });
        const uploadBucket = new aws_s3_1.Bucket(this, 'UploadBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });
        imageProcessor.addEventSource(new aws_lambda_event_sources_1.S3EventSource(uploadBucket, {
            events: [aws_s3_1.EventType.OBJECT_CREATED]
        }));
        new S3Upload_1.S3Upload(this, 'S3Upload', {
            Bucket: uploadBucket
        });
    }
}
exports.ExtractTextApiStack = ExtractTextApiStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdC10ZXh0LWFwaS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4dHJhY3QtdGV4dC1hcGktc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLGtFQUE0RDtBQUM1RCw4Q0FBOEM7QUFDOUMsb0RBQW9EO0FBQ3BELDZCQUE2QjtBQUM3Qix3REFBd0Q7QUFDeEQsZ0VBQXVEO0FBQ3ZELDBGQUFnRjtBQUNoRiw0Q0FBb0Q7QUFDcEQsZ0ZBQWtFO0FBQ2xFLG9EQUFpRDtBQUVqRCxNQUFhLG1CQUFvQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2hELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDMUQsSUFBSSxFQUFFLGlCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbkUsV0FBVyxFQUFFLHFCQUFxQjtTQUNuQyxDQUFDLENBQUM7UUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLGtDQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ2pFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLENBQUM7WUFDcEQsS0FBSyxFQUFFLG9CQUFvQjtZQUMzQixPQUFPLEVBQUUsb0JBQU8sQ0FBQyxVQUFVO1lBQzNCLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUNsQixVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2xDLENBQUMsQ0FBQTtRQUVGLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxzREFBc0IsQ0FBQztZQUN6RCxPQUFPLEVBQUUsY0FBYztTQUN4QixDQUFDLENBQUE7UUFFRixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFNUQsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUNaLElBQUksRUFBRSxZQUFZO1lBQ2xCLE9BQU8sRUFBRSxDQUFDLDZCQUFVLENBQUMsSUFBSSxDQUFDO1lBQzFCLFdBQVcsRUFBRSx1QkFBdUI7U0FDckMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxZQUFZLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNwRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQ3hDLGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFBO1FBRUYsY0FBYyxDQUFDLGNBQWMsQ0FBQyxJQUFJLHdDQUFhLENBQUMsWUFBWSxFQUFFO1lBQzVELE1BQU0sRUFBRSxDQUFDLGtCQUFTLENBQUMsY0FBYyxDQUFDO1NBQ25DLENBQUMsQ0FBQyxDQUFBO1FBRUgsSUFBSSxtQkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDN0IsTUFBTSxFQUFFLFlBQVk7U0FDckIsQ0FBQyxDQUFBO0lBRUosQ0FBQztDQUNGO0FBNUNELGtEQTRDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFB5dGhvbkZ1bmN0aW9uIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYS1weXRob24nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQ29kZSwgUnVudGltZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXl2Mic7XG5pbXBvcnQgeyBIdHRwTWV0aG9kIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXl2Mic7XG5pbXBvcnQgeyBMYW1iZGFQcm94eUludGVncmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnMnO1xuaW1wb3J0IHsgQnVja2V0LCBFdmVudFR5cGUgfSBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgUzNFdmVudFNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEtZXZlbnQtc291cmNlcyc7XG5pbXBvcnQgeyBTM1VwbG9hZCB9IGZyb20gJy4vQ29uc3RydWN0cy9TM1VwbG9hZCc7XG5cbmV4cG9ydCBjbGFzcyBFeHRyYWN0VGV4dEFwaVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGFsMUxheWVyID0gbmV3IGxhbWJkYS5MYXllclZlcnNpb24odGhpcywgJ2FsMS1sYXllcicsIHtcbiAgICAgIGNvZGU6IENvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdkb2NrZXInLCAnbGF5ZXInKSksXG4gICAgICBkZXNjcmlwdGlvbjogJ0FMMSBUZXNzZXJhY3QgTGF5ZXInXG4gICAgfSk7XG5cbiAgICBjb25zdCBpbWFnZVByb2Nlc3NvciA9IG5ldyBQeXRob25GdW5jdGlvbih0aGlzLCAnSW1hZ2UtUHJvY2Vzc29yJywge1xuICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdpbWFnZS1wcm9jZXNzb3InKSxcbiAgICAgIGluZGV4OiAnaW1hZ2UtcHJvY2Vzc29yLnB5JyxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuUFlUSE9OXzNfNixcbiAgICAgIGxheWVyczogW2FsMUxheWVyXSxcbiAgICAgIG1lbW9yeVNpemU6IDEwMjQsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgfSlcblxuICAgIGNvbnN0IHByb2Nlc3NJbWFnZUludGVncmF0aW9uID0gbmV3IExhbWJkYVByb3h5SW50ZWdyYXRpb24oe1xuICAgICAgaGFuZGxlcjogaW1hZ2VQcm9jZXNzb3JcbiAgICB9KVxuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuSHR0cEFwaSh0aGlzLCAnT0NSLUFwaS1HYXRld2F5Jyk7XG5cbiAgICBhcGkuYWRkUm91dGVzKHtcbiAgICAgIHBhdGg6ICcvcHJvY2Vzc29yJyxcbiAgICAgIG1ldGhvZHM6IFtIdHRwTWV0aG9kLlBPU1RdLFxuICAgICAgaW50ZWdyYXRpb246IHByb2Nlc3NJbWFnZUludGVncmF0aW9uXG4gICAgfSlcblxuICAgIGNvbnN0IHVwbG9hZEJ1Y2tldCA9IG5ldyBCdWNrZXQodGhpcywgJ1VwbG9hZEJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZVxuICAgIH0pXG4gICBcbiAgICBpbWFnZVByb2Nlc3Nvci5hZGRFdmVudFNvdXJjZShuZXcgUzNFdmVudFNvdXJjZSh1cGxvYWRCdWNrZXQsIHtcbiAgICAgIGV2ZW50czogW0V2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRF1cbiAgICB9KSlcblxuICAgIG5ldyBTM1VwbG9hZCh0aGlzLCAnUzNVcGxvYWQnLCB7XG4gICAgICBCdWNrZXQ6IHVwbG9hZEJ1Y2tldFxuICAgIH0pXG5cbiAgfVxufVxuIl19