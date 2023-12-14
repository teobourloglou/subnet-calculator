document.addEventListener('alpine:init', () => {
    Alpine.data('subnetLogic', () => ({
        ip_address: '',
        subnet_mask: '30',
        subnet_mask_dec: '255.255.255.252',
        subnet_values: [ 
            '128.0.0.0', '192.0.0.0', '224.0.0.0', '240.0.0.0', '248.0.0.0', '252.0.0.0', '254.0.0.0', '255.0.0.0',
            '255.128.0.0', '255.192.0.0', '255.224.0.0', '255.240.0.0', '255.248.0.0', '255.252.0.0', '255.254.0.0', '255.255.0.0',
            '255.255.128.0', '255.255.192.0', '255.255.224.0', '255.255.240.0', '255.255.248.0', '255.255.252.0', '255.255.254.0', '255.255.255.0',
            '255.255.255.128', '255.255.255.192', '255.255.255.224', '255.255.255.240', '255.255.255.248', '255.255.255.252',
        ],
        
        ipAddressDotCount: 0,
        
        network_address: '0.0.0.0',
        broadcast_address: '0.0.0.0',
        ip_range: '0.0.0.0 - 0.0.0.0',
        usable_hosts: '0',
        total_hosts: '0',
        cidr_notation: '0.0.0.0/30',
        wildcard_mask: '0.0.0.0',
        
        ipAddressChange () {
            let input = this.ip_address;

            // Ensures digits and dots only
            input = input.replace(/[^0-9.]/g, '');
            // Ensures no consecutive dots
            input = input.replace(/\.+/g, '.');
            // Ensures maximum 15 characters
            input = input.slice(0,15);
            
            let octets = input.split('.');
            this.ipAddressDotCount = octets.length - 1;

            octets = octets.map(octet => octet.slice(0, 3));

            let formattedInput = octets.join('.');

            this.ip_address = formattedInput;
            this.subnet();
        },

        subnetMaskChange () {
            this.subnet_mask_dec = this.subnet_values[this.subnet_mask - 1];
            if (this.ip_address) {
                this.subnet();
            }
        },

        subnet () {
            this.network_address = this.calculateNetworkAddress();
            this.broadcast_address = this.calculateBroadcastAddress();
            this.ip_range = this.calculateRange();
            this.cidr_notation = this.ip_address + "/" + this.subnet_mask;
            this.usable_hosts = this.calculateUsableHosts();
            this.total_hosts = this.calculateTotalHosts();
            this.wildcard_mask = this.calculateWildcardMask();
        },

        calculateNetworkAddress() {
            const ipBinary = this.ipToBinary(this.ip_address);
            const subnetMaskBinary = this.ipToBinary(this.subnet_mask_dec);
            const networkAddressBinary = this.bitwiseAND(ipBinary, subnetMaskBinary);
            return this.binaryToIp(networkAddressBinary);
        },

        calculateBroadcastAddress() {
            const subnetMaskBinary = this.ipToBinary(this.subnet_mask_dec);
            const invertedSubnetMaskBinary = this.bitwiseNOT(subnetMaskBinary);
            const broadcastAddressBinary = this.bitwiseOR(this.ipToBinary(this.network_address), invertedSubnetMaskBinary);
            return this.binaryToIp(broadcastAddressBinary);
        },

        calculateRange() {
            const firstUsableIp = this.incrementIpAddress()
            const lastUsableIp = this.decrementIpAddress()
            return firstUsableIp + " - " + lastUsableIp;
        },

        calculateUsableHosts() {
            const totalAddresses = Math.pow(2, 32 - this.subnet_mask);
            const usableHosts = Math.max(totalAddresses - 2, 0);
            return usableHosts;
        },
        
        calculateTotalHosts() {
            return Math.pow(2, 32 - this.subnet_mask);
        },

        calculateWildcardMask() {
            const binarySubnetMask = this.ipToBinary(this.subnet_mask_dec);
            const binaryWildcardMask = this.bitwiseNOT(binarySubnetMask);
            const wildcardMask = this.binaryToIp(binaryWildcardMask)
            return wildcardMask;
        },

        ipToBinary(ip) {
            const octets = ip.split('.');

            const binaryOctets = octets.map(octet => {
                const decimalValue = parseInt(octet);
                const binaryValue = decimalValue.toString(2);
                const paddedBinaryValue = binaryValue.padStart(8, '0');
                return paddedBinaryValue;
            });

            return binaryOctets.join('');
        },

        binaryToIp(binary) {
            const binaryParts = binary.match(/.{1,8}/g);

            const decimalOctets = binaryParts.map(part => parseInt(part, 2));
            const ipAddress = decimalOctets.join('.');

            return ipAddress;
        },

        bitwiseAND(binary1, binary2) {
            const bits1 = binary1.split('');
            const bits2 = binary2.split('');
            const resultBits = [];
        
            for (let index = 0; index < bits1.length; index++) {
                const resultBit = (bits1[index] === '1' && bits2[index] === '1') ? '1' : '0';
                resultBits.push(resultBit);
            }
        
            return resultBits.join('');
        },

        bitwiseOR(binary1, binary2) {
            const bits1 = binary1.split('');
            const bits2 = binary2.split('');
            const resultBits = [];
        
            for (let index = 0; index < bits1.length; index++) {
                const resultBit = (bits1[index] === '1' || bits2[index] === '1') ? '1' : '0';
                resultBits.push(resultBit);
            }
        
            return resultBits.join('');
        },

        bitwiseNOT(binary) {
            const bits = binary.split('');
            const resultBits = [];
        
            for (let index = 0; index < bits.length; index++) {
                const resultBit = (bits[index] === '1' ? '0' : '1');
                resultBits.push(resultBit);
            }
        
            return resultBits.join('');
        },

        incrementIpAddress() {
            const parts = this.network_address.split('.').map(part => parseInt(part));
            for (let i = parts.length - 1; i >= 0; i--) {
                if (parts[i] < 255) {
                    parts[i]++;
                    break;
                } else {
                    parts[i] = 0;
                }
            }
            return parts.join('.');
        },
        
        decrementIpAddress() {
            const parts = this.broadcast_address.split('.').map(part => parseInt(part));
            for (let i = parts.length - 1; i >= 0; i--) {
                if (parts[i] > 0) {
                    parts[i]--;
                    break;
                } else {
                    parts[i] = 255;
                }
            }
            return parts.join('.');
        }
               
    }));

});