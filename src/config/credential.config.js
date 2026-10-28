const config = {
   loginCred: {
        l0UserApplicationQueue: {
            username: process.env.l0UserNameAppliationQueue,
            password: process.env.l0Password,
        },
        l0UserPoolQueue: {
            username: process.env.l0UserNamePoolQueue,
            password: process.env.l0Password,
        },
        l1User: {
            username: process.env.l1UserName,
            password: process.env.l1Password,
        },
        l2User: {
            username: process.env.l2UserName,
            password: process.env.l2Password,
        },
        l3User: {
            username: process.env.l3UserName,
            password: process.env.l3Password,
        },
        superAdmin: {
            username: process.env.superAdminUserName,
            password: process.env.superAdminPassword,
        }
    }
}

export const ENV_DATA = config;