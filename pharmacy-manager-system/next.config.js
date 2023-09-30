/** @type {import('next').NextConfig} */


const nextConfig = {

    async redirects() {
        return [{
                source: '/',
                has: [{
                    type: 'cookie',
                    key: 'pharmacyauth.token',
                    value: undefined
                }, ],
                destination: '/pages/',
                permanent: false,
            },
            {
                source: '/pages/:slug*',
                missing: [{
                    type: 'cookie',
                    key: 'pharmacyauth.token',
                    value: undefined
                }, ],
                destination: '/',
                permanent: false,
            },


        ];
    },


}

module.exports = nextConfig