package main

import (
	"fmt"
	vpc "github.com/jaxxstorm/pulumi-aws-vpc/go"
	"github.com/pulumi/pulumi/sdk/v2/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v2/go/pulumi/config"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {

		stack := ctx.Stack()
		c := config.New(ctx, "")
		awsConfig := config.New(ctx, "aws")

		cidr := c.Require("cidrBlock")
		region := awsConfig.Require("region")

		/*
		 * Create a VPC
		 * this uses a component resource, which is defined on line 4
		 */
		awsVpc, err := vpc.NewVpc(ctx, fmt.Sprintf("lbriggs-%s", stack), vpc.Args{
			BaseCidr:    cidr,
			Description: fmt.Sprintf("lbriggs-%s-vpc", stack),
			ZoneName:    pulumi.String(fmt.Sprintf("%s.aws.lbrlabs.com", stack)),
			AvailabilityZoneNames: pulumi.StringArray{ // FIXME: use getAvailabilityZones here
				pulumi.String(fmt.Sprintf("%sa", region)),
				pulumi.String(fmt.Sprintf("%sb", region)),
				pulumi.String(fmt.Sprintf("%sc", region)),
			},
			BaseTags: pulumi.StringMap{
				"Owner":                         pulumi.String(fmt.Sprintf("lbriggs-%s", stack)),
				fmt.Sprintf("kubernetes.io/cluster/lbriggs-%s", stack): pulumi.String("shared"),
			},
			Endpoints: vpc.Endpoints{
				S3:       true,
				DynamoDB: true,
			},
		})

		if err != nil {
			return err
		}

		ctx.Export("id", awsVpc.ID)
		ctx.Export("arn", awsVpc.Arn)
		ctx.Export("publicSubnets", awsVpc.PublicSubnets)
		ctx.Export("privateSubnets", awsVpc.PrivateSubnets)
		ctx.Export("numberOfAzs", pulumi.Int(3))
		return nil
	})
}
