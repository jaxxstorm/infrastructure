import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const stack = pulumi.getStack()
let config = new pulumi.Config()

let accountName = config.require("accountName")
let domainName = config.require("domainName")
const name = `${accountName}-${stack}`

const account = new aws.organizations.Account(name, {
        name: name,
        email: `${name}@${domainName}`,
        roleName: "lbrlabsAdministrator",
}, {
    ignoreChanges: ["roleName"],
})

export const accountId = account.id
export const email = account.email

