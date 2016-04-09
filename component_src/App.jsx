import React from 'react';
import MatrixInput from './MatrixInput.jsx';
import ChartistGraph from 'react-chartist';
import ChartistLegend from './ChartistLegend.jsx';


class App extends React.Component {
     componentDidMount() {

        fetch('YOUR GOOGLE WEB APP CODE')
            .then(function(response) {
                if (response.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return response.json();
            })
            .then((results) => {
                let series = [];
                results[0].forEach(
                    result =>{
                        let counter = 0;
                          for(let i in result){
                             if(i !== 'Value'){
                                  if(series[counter] === undefined){
                                      series.push([]);
                                  }
                                  series[counter].push(result[i]);
                                  counter ++;
                              }
                          }
                    }
                )
                this.setState({series : series})
            });
    }
    
	constructor(props){
		super(props);
        this.state = {
            options : ['Love', 'Hate', 'Meh'],
            inptype : 'radio',
            labels : ['Marmite','Peanut butter','Jam','Nutella'],
            graphOps : {},
            type : 'Bar',
            answers : []
        };
        this.updateSeries = this.updateSeries.bind(this);
        this.updateAnswers = this.updateAnswers.bind(this);
	}
   
    
    updateSeries(e){
            let seriesOption,
            seriesLabel,
            seriesCopy = this.state.series.slice(0),
            submission = '';
        
        //Update series and submission data
        
        this.state.answers.forEach(
            
            answer => {
                let submissionSegment = {};
                this.state.options.forEach(function(value, i){
                    if(value === answer.value){
                        seriesOption = i;
                        submissionSegment[value] = 1;
                        submission = 'Value='+answer.name+'&'+answer.value+'=1';
                        fetch('YOUR GOOGLE WEB APP CODE'+submission, {
                        method: 'POST',
                        //body: JSON.stringify('')
                    }).then(response => console.log(response))
                    } else{
                        submissionSegment[value] = 0;
                    } 
                })
                 this.state.labels.forEach(function(value, i){
                    if(value === answer.name){
                        seriesLabel = i;
                    }   
                })
                 seriesCopy[seriesOption][seriesLabel] += 1;
                 submissionSegment.Value = answer.name;
                
            }
        )
        //update the page
        
        this.setState({series: seriesCopy});
         //send data

       
    }
    
    updateAnswers(e){
        let name = e.currentTarget.name,
            value = e.currentTarget.value,
            answersCopy = this.state.answers.slice(0),
            found = false;
            answersCopy.forEach(
                answer => {
                    if(name === answer.name){
                        answer.value = value;
                        found = true;
                    }
                }
            )
        
        if(found === false){
             answersCopy.push({name:name, value:value});
        }
        
        this.setState({answers:answersCopy});
        
    }

	render(){
        var overflow = {
            overflow: 'auto'
        };
		return (
			<div>
                <div style={overflow}>
                  <MatrixInput options={this.state.options} type={this.state.inptype} questions={this.state.labels} updateAnswers={this.updateAnswers} updateSeries={this.updateSeries}/>
                </div> 
                  <ChartistGraph data={this.state} options={this.state.graphOps} type={this.state.type} />
                  <ChartistLegend legend={this.state.options}/>
			</div>
		)
	}
}

export default App