import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const stack = pulumi.getStack()
const name = `lbriggs-${stack}`
const tagName = `kubernetes.io/cluster/${name}`

// get config values
let config = new pulumi.Config()
let cidrBlock = config.get("cidrBlock")

const vpc = new awsx.ec2.Vpc(name, {
    subnets: [
        { type: "public", tags: { tagName: "shared", "kubernetes.io/role/elb": "1" } },
        { type: "private", tags: { tagName: "shared", "kubernetes.io/role/internal-elb": "1" }  },
    ],
    tags: {
        "Name": name,
        "Owner": "lbriggs",
    },
    cidrBlock: cidrBlock
})

export const vpcId = vpc.id
export const privateSubnets = vpc.privateSubnetIds
export const publicSubnets = vpc.publicSubnetIds
