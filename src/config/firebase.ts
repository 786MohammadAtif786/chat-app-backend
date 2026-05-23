// import admin from "firebase-admin";

// // Firebase Console > Project Settings > Service Accounts > Generate New Private Key
// const serviceAccount = require("./serviceAccountKey.json");

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// module.exports = admin;


// backend/src/lib/firebaseAdmin.ts
// import admin from "firebase-admin";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: "push-notification-app-f2fed",
//       clientEmail: "YOUR_SERVICE_ACCOUNT_EMAIL", // Firebase Console se
//       privateKey: "YOUR_PRIVATE_KEY".replace(/\\n/g, "\n"),
//     }),
//   });
// }

// export default admin;


import admin from "firebase-admin";

if (!admin.apps.length) {

  admin.initializeApp({

    credential:
      admin.credential.cert({

        projectId:
          "push-notification-app-f2fed",

        clientEmail:
          "firebase-adminsdk-fbsvc@push-notification-app-f2fed.iam.gserviceaccount.com",

        privateKey:
`-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDa5jnN6aRj6p5i
TU1rLzpPo/pWtEvv6N0lofPdFHhnTChtttzH0cdKUq/TdJj8SbllCDbwe1IhCSel
/OUucsotb0OtHc9NQXh986bG0G4d1NoF8TofVjGoslNEhVR7rEnnhxnkNgX/R7X+
CYCkAJcLessgV1rtJlcIMto7nEJh/tm4zIb2GceaXgntymKZOC0ZoK/s7LAq/Hfj
wWkA4EcTwoDV9V4i421UsZyChjCM2RrVO4hAypl62+Nj+11FvQ75LRRUdygYepCf
HC18EEntnJy2i6np2z/2sWw35sXDGN0SGD13CgRca5PQKOTLLGoYmthCh0u4IcWp
zd0GxqsBAgMBAAECggEAXpYVyy6WnKAQMTzi45pEMY6TCS0eFPwDtxOses6yGjyT
yZi2/NbeLPTeydm7k2RN6mSqzK4U9nZsvfIxm6j5SLmnviG/5kuQg6gpXAZLVrOX
Q/MQ4OKPUaxAg76zGz9+rb84hl57p+u2LZ+wiO1CVzEHnaFxhkDHYaELoK9sFchK
80vHi/K5ogcnsJSum//IeaslrAE2rovfXhUlI1/C/e4jHx62Ezct/WqRzFp+2LnM
bJGHPbp2siWRqr5+GR9vhIswYnnv1XzXEKOo94RJuW4ophgSigBsvltvgjkcG/xF
G8ALCCDpDiX27VCOIdtqPJPNu0/W4bQ8cUDvlckegwKBgQD+W15V8klxO2SHO4tq
JNY6fYaB8VFVj2VZLlSATDAIrgUUEJw7vmlDD/kaD8O6RSSQRb1IUb7W6Y29NS67
YzOCLBY2/mzvZZr5gH7I1k1otD6jWC9BXB0C+uoT2KWbxaNdIr1SHpnWUlfj+WRn
k0PnwbG9C/O9LNjumQlScpGp6wKBgQDcUDiLexzTBrI5Mt+HWmut9KqSqQXRD7j3
csFPKSk7bjkL+hyfh5vlZ7kiyrwIYzVNMGEC8WKtEcVMYz01kPbdgZN7ZRtTsWOm
rFMBnxeIblRChvnOwUooVDqt2BdtgAjCzKK0IJ7/GTbY7YfNzU7M+6opjdyaXjgM
A1XaKAJ3wwKBgQCdbgnWYk7Ikb0n4lfoy4H408aT2LvBnC5bY0yT2BQG20ZzY9B/
PdxC0LkaQ1WejbsSvMdp4oae2BGNYURaYQz5bbYWNaVRCu8/rCNMxS9GNgFq8mLV
LmEafhixTe86mboCJEVPdXc76t1RUgOuA70MzZrn6mTi2sYt73SQni7AHwKBgHMj
7dlftznGlyBzqQTpSbt5Uigh8+tGB0ozjDnd7jGkMmZDCfCKA/zJz6USRWEw0CuO
LDVIiGShE/cPKm8zWwF69eQYfEaqP8Vc7Gi9h6QC3UCDoEzhEeuv0ZcHh37v2iRM
pH/1SINT3ylSQpZZRWS15kGfZXq74RjOKXFBVcDXAoGAQJP2jeJtZmC+4YHyl7HH
6XbBhlxGYHuw/QsZmT0CyIkDxwTXwpxLiXK8tcBivB2ZVkYOYgnotfV0OMWoHCWm
xTQgGU60crFuXKZ3h0/6gxoHMk8w+IoSVxAyVyZ5POmRF4wgWRb9BnVx4cUKYwwn
IMvlv5R8MvXWAy5IvJeWuoM=
-----END PRIVATE KEY-----`
      })
  });
}

export default admin;