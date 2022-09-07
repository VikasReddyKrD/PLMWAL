import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
//Static Resource
import D3 from '@salesforce/resourceUrl/d3Graph';

export default class D3Graph extends LightningElement {
    /* svgWidth = 300;
    svgHeight = 200; */
    @api recordId;
    d3Initialized = false;
    @track account;
    renderedCallback() {
        if (this.d3Initialized) {
            return;
        }
        this.d3Initialized = true;
        console.log('inside renderedCallback');
        Promise.all([
            loadScript(this, D3 + '/d3.v5.min.js'),
            // loadStyle(this, D3 + '/style.css')
        ])
            .then(() => {
                this.initializeD3();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading D3',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }

    initializeD3() {
        // Example adopted from https://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7
        const sample = [
            {
                language: 'starting point',
                value: 10,
                color: 'grey'
            },
            {
                language: 'Halfway towards goal',
                value: 50,
                color: 'grey'
            },
            {
                language: 'target',
                value: 100,
                color: 'teal'
            },
            {
                language: 'somewhat more than expected',
                value: 150,
                color: 'grey'
            },
            {
                language: 'much more than expected',
                value: 200,
                color: 'grey'
            }
        ];
        const svg = d3.select(this.template.querySelector('svg'));
        //const svgContainer = d3.select('#container');
        let styles = this.template.querySelector('svg').style
        const margin = 50;
        const width = 700;
        const height =300;
        const chart = svg
            .append('g')
            .attr('transform', `translate(${margin}, ${margin})`);
        const xScale = d3.scaleBand()
            .range([0, width])
            .domain(sample.map((s) => s.language))
            .padding(0.6)
        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 197, 500]);
        const makeYLines = () => d3.axisLeft()
            .scale(yScale)
        chart.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));
        chart.append('g')
            .call(d3.axisLeft(yScale));
        chart.append('g')
            .attr('class', 'grid')
            .call(makeYLines()
                .tickSize(0, 0, 0)
                .tickFormat('')
            )
        const barGroups = chart.selectAll()
            .data(sample)
            .enter()
            .append('g')
        barGroups
            .append('rect')
            .attr('style', (g) => "fill: " + g.color)
            .attr('x', (g) => xScale(g.language))
            .attr('y', (g) => yScale(g.value))
            .attr('height', (g) => height - yScale(g.value))
            .attr('width', xScale.bandwidth())
        barGroups
            .append('text')
            .attr('class', 'value')
            .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.value) + 30)
            .attr('text-anchor', 'middle')
    }

}