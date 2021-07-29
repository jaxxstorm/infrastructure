import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";

let config = new pulumi.Config()
const stack = pulumi.getStack()
const name = `lbriggs-${stack}`
const vpc = new pulumi.StackReference(`jaxxstorm/vpc/${stack}`);
const vpcId = vpc.getOutput("id")
const privateSubnets = vpc.getOutput("privateSubnets")
const publicSubnets = vpc.getOutput("publicSubnets")

// Define the AWS provider credential opts to configure the cluster's
// kubeconfig auth.
const kubeconfigOpts: eks.KubeconfigOptions = {profileName: "pulumi-dev-sandbox"};

const cluster = new eks.Cluster(name, {
    providerCredentialOpts: kubeconfigOpts,
    name: name,
    vpcId: vpcId,
    privateSubnetIds: privateSubnets,
    publicSubnetIds: publicSubnets,
    createOidcProvider: true,
    tags: {
        Owner: "lbriggs"
    }
})

export const clusterName = cluster.eksCluster.name
export const kubeconfig = cluster.kubeconfig
export const clusterOidcProvider = cluster.core.oidcProvider?.url
export const clusterOidcProviderArn = cluster.core.oidcProvider?.arn
