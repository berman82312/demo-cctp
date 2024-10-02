import { type Hash } from '@/app/types/models'
export class AttestationService {
    async getSignature(messageHash: Hash) {
        let attestationResponse = { status: 'pending', attestation: '' };

        while (attestationResponse.status != 'complete') {
            const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
            attestationResponse = await response.json()
            await new Promise(r => setTimeout(r, 2000));
        }

        const attestationSignature = attestationResponse.attestation;

        return attestationSignature
    }
}