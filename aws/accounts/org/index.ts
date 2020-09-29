import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

let config = new pulumi.Config()
let accountName = config.require("accountName")

const org = new aws.organizations.Organization(`master`, {
    featureSet: 'ALL',
    awsServiceAccessPrincipals: [
        "sso.amazonaws.com",
    ],
    enabledPolicyTypes: [
        "SERVICE_CONTROL_POLICY",
        "TAG_POLICY",
        "BACKUP_POLICY",
    ]
}, { import: accountName })


export const orgId = org.masterAccountId
export const parentId = org.


