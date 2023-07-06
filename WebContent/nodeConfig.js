var config = {
    readFromMock: false, //read from file
    neverConnectToServer: false, //force read from file or die!
    cacheFiles: false, //cache to file
    target: {
        'RestProj': {
            'server': 'http://localhost:8080/RestProj',
            'clientDirectory': 'restproj',
            'staticFileDirectory': 'src/main/webapp'
        },
        'Dabi': {
            'server': 'http://viradev.ir:8108/Dabi',
            'clientDirectory': 'dabi-web',
            'staticFileDirectory': 'src/main/webapp'
        },
        'ddp': {
            'server': 'http://viradev.ir:8072/ddp',
            'clientDirectory': 'ddp',
            'staticFileDirectory': 'src/main/webapp'
        },
        'GraphVisualizer': {
            'server': 'http://viradev.ir:8072/GraphVisualizer',
            'clientDirectory': 'GraphVisualizer',
            'staticFileDirectory': 'src/main/webapp'
        },
        'CrawlerDataManagement': {
            'server': 'http://178.22.121.250:8103/CrawlerDataManagement',
            // 'server': 'https://185.208.77.111:8443/CrawlerDataManagement',
            'clientDirectory': 'CrawlerDataManagement',
            'staticFileDirectory': 'src/main/webapp'
        },
        'PollManagement': {
            'server': 'http://192.168.2.59:8080/PollManagement',
            'clientDirectory': 'PollManagement',
            'staticFileDirectory': 'WebContent'
        },
        'trasimui': {
            'server': 'http://localhost:8080/trasimui',
            'clientDirectory': 'trasimui',
            'staticFileDirectory': 'WebContent'
        },
        'Inquiry': {
            'server': 'http://192.168.2.15:8080/Inquiry',
            'clientDirectory': 'Inquiry',
            'staticFileDirectory': 'WebContent'
        },
        'TooskaWebApp': {
            'server': 'http://tooskaocr.ir',
            'clientDirectory': 'tooska-web-app',
            'staticFileDirectory': 'WebContent'
        },
        'VShop': {
            'server': 'http://89.235.69.85:8117/VShop',
            'clientDirectory': 'VShop',
            'staticFileDirectory': 'src/main/webapp'
        },
        'Ganjeh': {
            'server': 'https://docteav.saadev.ir/Ganjeh',
            'clientDirectory': 'ganjeh',
            'staticFileDirectory': 'src/main/webapp'
        },
		'Ganjeh-build': {
            'server': 'https://docteav.saadev.ir/Ganjeh',
            'clientDirectory': 'ganjeh',
            'staticFileDirectory': 'src/main/webapp/dist'
        },
		'Kateb': {
            'server': 'https://kateb.saadev.ir/Kateb',
            'clientDirectory': 'kateb',
            'staticFileDirectory': 'WebContent'
        }
    }
};
module.exports = config;
