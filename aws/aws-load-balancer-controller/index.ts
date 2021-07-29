import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as lb from "@jaxxstorm/pulumi-aws-loadbalancercontroller";

const stack = pulumi.getStack()
const name = `loadbalancer-controller-${stack}`
const cluster = new pulumi.StackReference(`jaxxstorm/eks/${stack}`);

// get the provider from the cluster
// we need to stringify this because the eks lib returns an output for the kubeconfig
const kubeconfig = cluster.getOutput("kubeconfig").apply(k => JSON.stringify(k))
const provider = new k8s.Provider("k8s", { kubeconfig: kubeconfig });

const foo = new lb.AWSLoadBalancerController('foo', {
    namespace: {
        create: true,
        name: "aws-load-balancer-controller"
    },
    cluster: {
        name: "lbriggs-dev",
    },
    app: {
        version: "v2.0.0",
    },
    installCRD: true
}, { provider: provider })

