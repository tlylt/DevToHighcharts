async function makeGetRequestAndReturnJson() {
    const response = await fetch('https://dev.to/api/articles?per_page=1000');
    return await response.json();
}

async function processData() {
    const targetTags = ['react', 'opensource', 'codenewbie', 'beginners', 'tutorial', 'webdev', 'showdev', 'productivity'];
    const seriesData = [{ // for illustration purposes, could be done with a loop
        name: 'react',
        data: []
    },
    {
        name: 'opensource',
        data: []
    },
    {
        name: 'codenewbie',
        data: []
    },
    {
        name: 'beginners',
        data: []
    },
    {
        name: 'tutorial',
        data: []
    },
    {
        name: 'webdev',
        data: []
    },

    {
        name: 'showdev',
        data: []
    },
    {
        name: 'productivity',
        data: []

    }];
    const data = await makeGetRequestAndReturnJson();
    const filteredData = data.filter(article => article.tag_list.some(tag => targetTags.includes(tag)))
    filteredData.forEach(article => {
        const filteredTags = article.tag_list.filter(tag => targetTags.includes(tag))
        filteredTags.forEach(tag => {
            seriesData.find(type => type.name === tag).data.push(
                {
                    title: article.title,
                    url: article.url,
                    value: article.comments_count + article.positive_reactions_count // reaction count
                })
        });
    })
    return seriesData;
}


async function setupGraph() {
    const seriesData = await processData()
    chart = new Highcharts.chart('container', {
        chart: {
            type: 'packedbubble',
            height: '50%',
        },
        title: {
            text: 'Visualizing Dev.to articles'
        },
        tooltip: {
            useHTML: true,
            stickOnContact: true,
            pointFormat: '<b>{point.title}:</b> <br/>Reaction Count: {point.value} <br/><a target="_blank" href={point.url}>{point.url}</a>'
        },

        plotOptions: {
            packedbubble: {
                useSimulation: false, // true for a better animation
                minSize: '30%',
                maxSize: '100%',
                zMin: 0,
                zMax: 2000, // the max value of the bubble
                layoutAlgorithm: {
                    gravitationalConstant: 0.01,
                    splitSeries: false,
                    seriesInteraction: true,
                    dragBetweenSeries: true,
                    parentNodeLimit: true,
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.title}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 1000 // labeling the articles with over 1000 in reaction counts
                    },
                    style: {
                        // adjusting of styles for data labels
                        color: 'black',
                        // textOutline: 'none',
                        // fontWeight: 'normal',
                    },

                },
            }
        },
        series: seriesData,
    });
}

// trigger setupGraph function on document ready
document.addEventListener('DOMContentLoaded', () => {
    setupGraph();
})
