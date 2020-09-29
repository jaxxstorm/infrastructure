import * as k8s from "@pulumi/kubernetes";
import * as cx from "pulumi-chartmuseumx"
import * as pulumi from "@pulumi/pulumi";

const stack = pulumi.getStack()
const name = `chartmuseum-${stack}`
const cluster = new pulumi.StackReference(`jaxxstorm/eks/${stack}`);

// get the provider from the cluster
const provider = new k8s.Provider("k8s", { kubeconfig: cluster.getOutput("kubeconfig") });

const cm = new cx.ChartMuseum("foo", {
    service: {
        type: "LoadBalancer"
    }
})

const chartmuseum = new cx.ChartMuseum(name, {
    service: {
        type: "LoadBalancer"
    },
    api: true,
}, { provider: provider })
