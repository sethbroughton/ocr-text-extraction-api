import * as cdk from '@aws-cdk/core';
import { PythonFunction } from '@aws-cdk/aws-lambda-python';
import * as lambda from '@aws-cdk/aws-lambda';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import * as path from 'path';
import * as apigateway from '@aws-cdk/aws-apigatewayv2';
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Bucket, EventType } from '@aws-cdk/aws-s3';
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';
import { S3Upload } from './Constructs/S3Upload';

export class ExtractTextApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const al1Layer = new lambda.LayerVersion(this, 'al1-layer', {
      code: Code.fromAsset(path.join(__dirname, '..', 'docker', 'layer')),
      description: 'AL1 Tesseract Layer'
    });

    const imageProcessor = new PythonFunction(this, 'Image-Processor', {
      entry: path.join(__dirname, '..', 'image-processor'),
      index: 'image-processor.py',
      runtime: Runtime.PYTHON_3_6,
      layers: [al1Layer],
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
    })

    const processImageIntegration = new LambdaProxyIntegration({
      handler: imageProcessor
    })

    const api = new apigateway.HttpApi(this, 'OCR-Api-Gateway');

    api.addRoutes({
      path: '/processor',
      methods: [HttpMethod.POST],
      integration: processImageIntegration
    })

    const uploadBucket = new Bucket(this, 'UploadBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    })
   
    imageProcessor.addEventSource(new S3EventSource(uploadBucket, {
      events: [EventType.OBJECT_CREATED]
    }))

    new S3Upload(this, 'S3Upload', {
      Bucket: uploadBucket
    })

  }
}
