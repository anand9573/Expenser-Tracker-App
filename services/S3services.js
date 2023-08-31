const AWS=require('aws-sdk');

exports.uploadToS3=async(data,filename)=>{
    const BUCKET_NAME=process.env.BUCKET_NAME;
    let s3bucket=new AWS.S3({
        accessKeyId:process.env.IAM_USER_KEY,
        secretAccessKey:process.env.IAM_USER_SECRET
    })
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }
        try {
            const s3response = await s3bucket.upload(params).promise();
            console.log('success', s3response);
            return s3response.Location;
        } catch (err) {
            console.log('something went wrong', err);
            throw err;
        }
    }