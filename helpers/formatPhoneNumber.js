

export const formatPhoneNumber = (input) => {
    let cleaned = ('' + input).replace(/\D/g, ''); 

    if (!cleaned.startsWith('54')) {
        return '+' + cleaned;
    }

    let remainingNumber = cleaned.substring(2); 

    if (remainingNumber.startsWith('9')) {
        remainingNumber = remainingNumber.substring(1);
    }

    let areaCode = '';
    let localNumber = '';

    // Buenos Aires (código de área de 2 dígitos)
    if (remainingNumber.startsWith('11')) {
        areaCode = '11';
        localNumber = remainingNumber.substring(2);
    } else { 
    // Otras provincias (códigos de área de 3 dígitos)
        areaCode = remainingNumber.substring(0, 3);
        localNumber = remainingNumber.substring(3);
    }

    if (localNumber.length === 6 || localNumber.length === 7) {
        localNumber = '15' + localNumber;
    }

    return `+54${areaCode}${localNumber}`;
};

