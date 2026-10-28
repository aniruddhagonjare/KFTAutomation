export async function getPartnerWiseSelection(partner) {
    switch (partner) {
        case 'Muthoot':
            return {
                "PartnerId": "Muthoot",
                "PartnerName": "Muthoot Finance"
            };
        case 'digitmoney':
            return {
                "PartnerId": "digi",
                "PartnerName": ""
            };
        case 'indialends':
            return {
                "PartnerId": "indialends",
                "PartnerName": ""
            };
        case 'niyo':
            return {
                "PartnerId": "niyo",
                "PartnerName": " Bank"
            };
        case 'insuranceDekho':
            return {
                "PartnerId": "insuranceDekho",
                "PartnerName": ""
            };
            case 'dhanlift':
            return {
                "PartnerId": "dhanlift",
                "PartnerName": ""
            };
        default:
            throw new Error(`Unknown partner: ${partner}`);
    }          
}     