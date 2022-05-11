class Ip{
    async getIp(){
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            console.log(response.data.ip);
            return response.data.ip;
        } catch (error) {
            return '';
        }
    }
}