import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as v from "@jen20/pulumi-aws-vpc";

async function main() {


    const config = new pulumi.Config();
    const azCount = config.getNumber("azCount") || 1;

    // Look up available zones in the target region
    const availabilityZones = await aws.getAvailabilityZones({
        state: "available",
    });

    // Create VPC. Subnets are distributed across the availability zones
    // obtained from the call above.
    const vpc = new v.Vpc("lbriggs-vpc", {
        description: "lbriggs-vpc",
        baseCidr: "192.168.0.0/16",
        availabilityZoneNames: availabilityZones.names.slice(0, azCount),
        endpoints: {
            dynamodb: true,
            s3: true,
        },
        baseTags: {
            Project: "lbriggs-vpc",
        },
    });

    // Enable VPC flow logging to CloudWatch Logs for all traffic in the VPC.
    vpc.enableFlowLoggingToCloudWatchLogs("ALL");

    return {
        vpcId: vpc.vpcId(),
        publicSubnetIds: vpc.publicSubnetIds(),
        privateSubnetIds: vpc.privateSubnetIds(),
    }
}

module.exports = main()
