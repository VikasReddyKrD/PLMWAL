import { LightningElement, api } from 'lwc';
import getSurveyGoals from '@salesforce/apex/SurveyController.getSurveyGoals';
import Pro from '@salesforce/label/c.Pro';
import Pro1 from '@salesforce/label/c.Pro1';
export default class ProResults extends LightningElement {
    label = {
        Pro, Pro1
    };
    data;
    isEmptyData = false;
    severityRender = false;
    connectedCallback() {
        try {
            getSurveyGoals()
                .then(result => {
                    this.data = result;
                    console.log("data====>" + console.log(JSON.stringify(this.data)));
                    console.log("data11111", result);
                    if (result.length == 0) {
                        this.isEmptyData = true;
                    }
                    else {
                        this.isEmptyData = false;
                    }

                    this.data.forEach(each => {
                        if (each.proQuestion == "Quality of Life Enjoyment and Satisfaction Questionnaire (Q-LES-Q-SF)") {
                            each.prodataAnswer.forEach(answer => {
                                answer.value = answer.value.includes("-") ? answer.value.split("-")[1] : 0;
                            })
                        }
                        else if (each.proQuestion == "Patient Health Questionnaire - 9 (PHQ-9)") {
                            each.prodataAnswer.forEach(answer => {
                                console.log('answer--+',answer);
                                console.log('answer--+',JSON.stringify(answer));
                                // answer.value = answer.value.includes(",") ? answer.value.split("-")[1] : 0;
                                let val = answer.value.split(",") ;
                                console.log('Praveen',val);
                                const valResult = val.map(str => {
                                    return Number(str);
                                  });
                                  console.log('vikas',valResult);
                                // let valResult = Number(val);
                                // console.log('vikasss',valResult);
                                answer.value = valResult.reduce((previousValue, currentValue) => previousValue + currentValue);
                                // console.log('total',typeof(answer.value));

                            })
                        }
                        else if (each.proQuestion == "WHO (Five) Well-Being Index" ||
                            each.proQuestion == "Connor-Davidson Resilience Scale 10 (CD-RISC-10)" ||
                            each.proQuestion == "WHO(Five) Well-Being Index (1998 Version)") {
                            each.prodataAnswer.forEach(answer => {
                                let val = (answer.value != '0') ? JSON.parse(answer.value) : 0;
                                const initialValue = 0;
                                if (typeof val == 'object') {
                                    answer.value = val.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
                                }
                            })
                        }
                        else if (each.proQuestion == "Snaith - Hamilton Pleasure Scale (SHAPS)") {
                            each.prodataAnswer.forEach(answer => {
                                let val = (answer.value != '0') ? answer.value.split(",") : 0;
                                if (val != 0) {
                                    console.log("testing")
                                    const initialValue = 0;
                                    answer.value = val.reduce(
                                        (previousValue, currentValue) => Number(previousValue) + Number(currentValue),
                                        initialValue
                                    );

                                }
                            })
                        }
                        else if (each.proQuestion == "Perceived Deficits Questionnaire - Depression (PDQ-D5)") {
                            each.prodataAnswer.forEach(answer => {
                                answer.value = (answer.value != '0') ? Number(JSON.parse(answer.value).calculation) : 0;
                            })
                        }
                    })
                });
            this.data.forEach(each => {
                if (each.proQuestion == "Patient Health Questionnaire - 9 (PHQ-9)" || each.proQuestion == "Snaith - Hamilton Pleasure Scale (SHAPS)") {
                    each.prodataAnswer.forEach(answer => {
                        if ((answer.value >= 1 && answer.value <= 4)) {
                            answer.severity = "Minimal depression"
                        } else if ((answer.value >= 5 && answer.value <= 9)) {
                            answer.severity = "Mild depression"
                        } else if ((answer.value >= 10 && answer.value <= 14)) {
                            answer.severity = "Moderate depression"
                        } else if ((answer.value >= 15 && answer.value <= 19)) {
                            answer.severity = "Moderately severe depression"
                        } else if ((answer.value >= 20 && answer.value <= 27)) {
                            answer.severity = "severe depression"
                        }
                    });

                }
            })
                .catch(error => {
                    console.log("error", error);
                });
        }
        catch (error) {
            console.log(error);
        }
    }
    @api
    downloadPros(event) {
        try {
            const chartObjs = this.template.querySelectorAll('c-pro-results');
            // this.template.querySelectorAll('c-mdd-report-chart-j-s-chart-l-w-c').forEach(each => { each.className = 'slds-no-print' })
            // window.print();

            let paramData = 'slds-no-print';
            let ev = new CustomEvent('childmethod1',
                { detail: paramData }
            );
            this.dispatchEvent(ev);
        }
        catch (error) {
            console.error('Error occured while downloading the chart: ' + error.message);
        }
    }

}