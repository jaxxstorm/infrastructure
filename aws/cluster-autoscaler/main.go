package main

import (
	"fmt"
	"github.com/jaxxstorm/pulumi-clusterautoscalerx"
	"github.com/pulumi/pulumi/sdk/v2/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {

		var err error

		_, err = clusterautoscaler.NewClusterAutoscaler(ctx, fmt.Sprintf("cas-%s", ctx.Stack()), clusterautoscaler.Args{
			Namespace: "kube-system",
			ClusterName: fmt.Sprintf("lbriggs-%s", ctx.Stack()),
		})

		if err != nil {
			return err
		}
		return nil

	})
}
