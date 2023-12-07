document.addEventListener('alpine:init', () => {
    Alpine.data('subnetLogic', () => ({
        ip_address: '',
        subnet_mask: '/8',
        subnet_mask_dec: '128.0.0.0',
        subnet_values: [
            '128.0.0.0',
            '192.0.0.0',
            '224.0.0.0',
            '240.0.0.0',
            '248.0.0.0',
            '252.0.0.0',
            '254.0.0.0',
            '255.0.0.0',
            '255.128.0.0',
            '255.192.0.0',
            '255.224.0.0',
            '255.240.0.0',
            '255.248.0.0',
            '255.252.0.0',
            '255.254.0.0',
            '255.255.0.0',
            '255.255.128.0',
            '255.255.192.0',
            '255.255.224.0',
            '255.255.240.0',
            '255.255.248.0',
            '255.255.252.0',
            '255.255.254.0',
            '255.255.255.0',
            '255.255.255.128',
            '255.255.255.192',
            '255.255.255.224',
            '255.255.255.240',
            '255.255.255.248',
            '255.255.255.252',
            '255.255.255.254',
            '255.255.255.255',
        ],
        
        ipAddressDotCount: 0,
        
        network_address: '',
        broadcast_address: '',
        ip_range: '',
        usable_hosts: '',
        total_hosts: '',
        cidr_notation: '',
        wildcard_mask: '',
        
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

        octetToBinary(num) {
            if (num === 0) return "0"; 
  
            let array = []; 
            for (; num > 0; num = Math.floor(num / 2)) { 
                array.unshift(num % 2); 
            }

            while (array.length < 8) {
                array.unshift("0");
            }

            return array.join("");
        },

        ipToBinary() {
            let octets = this.ip_address.split('.');
            let ip = [];
            octets.forEach(octet => {
                let binaryOctet = this.octetToBinary(octet);
                (binaryOctet.length > 8) ? console.log("Error") : ip.push(binaryOctet);
            });
            if (ip.length > 4) ip.length = 4;
            
            return ip.join("");
        },

        subnetToBinary() {
            let octets = this.subnet_mask_dec.split('.');
            let ip = [];
            octets.forEach(octet => {
                let binaryOctet = this.octetToBinary(octet);
                (binaryOctet.length > 8) ? console.log("Error") : ip.push(binaryOctet);
            });
            if (ip.length > 4) ip.length = 4;
            
            return ip.join("");
        },

        subnet () {
            let ip = this.ipToBinary();
            let mask = this.subnetToBinary();

            ipArray = ip.split("");
            maskArray = mask.split("");
            resultArray = [];
            decimalArray = [];

            for (let i = 0; i < 32; i++) {
                resultArray.push(parseInt(ipArray[i]) & parseInt(maskArray[i]))
            }

            let octets = this.createArrays(resultArray, 8)
            octets.forEach(octetArray => {
                let base2 = 128;
                let decimal = 0;
                octetArray.forEach(bit => {
                    if (bit == 1) {
                        decimal = decimal + base2;
                    }
                    base2 /= 2;
                });
                decimalArray.push(decimal);
            });

            this.network_address = decimalArray.join(".");
            this.cidr_notation = this.ip_address + "/" + this.subnet_mask
            
        },

        createArrays(originalArray, chunkSize) {
            return Array.from({ length: Math.ceil(originalArray.length / chunkSize) }, (_, index) =>
                originalArray.slice(index * chunkSize, (index + 1) * chunkSize)
            );
        }

        
    }));

});