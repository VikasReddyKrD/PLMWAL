public class PLM_ReadJsonData {
    public static void read(){
        StaticResource sr= [select id,body from StaticResource Where Name = 'PLM_Seqster_Json'];
        String allcontents = sr.body.toString().replaceAll('system','system_x').replaceAll('class','class_y');//.replaceAll('end','end_x');
        PLM_JsonWrapper wrapper = (PLM_JsonWrapper)JSON.deserialize(allcontents,PLM_JsonWrapper.class);
        system.debug('SR@@@::::::'+allcontents);
        system.debug('resorce'+wrapper);
        system.debug('resorce'+wrapper.meta.versionId);
        
        Seqster_Data__c data = new Seqster_Data__c();
        data.Type__c = wrapper.Type;
        data.Total__c=wrapper.total;
        data.ResourceType__c =wrapper.resourceType;
        insert data;
        
        List<Meta__c> metaList = new List<Meta__c>();
        Meta__c meta = new Meta__c();
        meta.Seqster_Data__c = data.id;
        meta.VersionId__c = wrapper.meta.versionId;
        metaList.add(meta);
        insert metaList;
        
        List<Link__c> linkList = new List<Link__c>();
        for(PLM_JsonWrapper.Link wrapperlink :wrapper.link ){
            Link__c link = new Link__c();
            link.URL__c = wrapperlink.url;
            link.Seqster_Data__c = data.Id;
            link.Relation__c = wrapperlink.relation;
            linkList.add(link);
        }
        insert linkList;
        
        
        List<Entry__c> entrylist = new List<Entry__c>();
        Map<String,List<PLM_JsonWrapper.Link>> linkMap = new Map<String,List<PLM_JsonWrapper.Link>>();
        Map<String,PLM_JsonWrapper.Resource> resourceMap = new Map<String,PLM_JsonWrapper.Resource>();
        for(PLM_JsonWrapper.Entry wrapperEntry: wrapper.entry){
            Entry__c entry = new Entry__c();
            entry.Seqster_Data__c = data.Id;
            entry.Full_URL__c = wrapperEntry.fullUrl;
            linkMap.put(entry.Full_URL__c,wrapperEntry.link);
            resourceMap.put(entry.Full_URL__c,wrapperEntry.resource);   
            entrylist.add(entry);
        }
        insert entrylist;
        List<Link__c> innerLinkList = new List<Link__c>();
        for(Entry__c entry:entrylist){
            for(String fullURL:linkMap.keySet()){
                if(fullURL == entry.Full_URL__c){
                    List<PLM_JsonWrapper.Link> linkWrapperList = linkMap.get(fullURL);
                    for(PLM_JsonWrapper.Link wrapperLink:linkWrapperList){
                        Link__c link = new Link__c();
                        link.Relation__c = wrapperLink.relation;
                        link.URL__c = wrapperLink.url;
                        link.Entry__c = entry.Id;
                        innerLinkList.add(link);
                    }
                }
            }
        }
        insert innerLinkList;
        
        Map<String,PLM_JsonWrapper.Patient> patientMap = new Map<String,PLM_JsonWrapper.Patient>();
        Map<String,PLM_JsonWrapper.ClinicalStatus> clinicalStatusMap = new Map<String,PLM_JsonWrapper.ClinicalStatus>();
        Map<String,PLM_JsonWrapper.Encounter> encounterMap = new Map<String,PLM_JsonWrapper.Encounter>();        
        Map<String,PLM_JsonWrapper.Meta> metaMap = new Map<String,PLM_JsonWrapper.Meta>();        
        Map<String,PLM_JsonWrapper.Asserter> asserterMap = new Map<String,PLM_JsonWrapper.Asserter>();
        Map<String,PLM_JsonWrapper.Code> codeMap = new Map<String,PLM_JsonWrapper.Code>();
        Map<String,PLM_JsonWrapper.MedicationCodeableConcept> medicationMap = new Map<String,PLM_JsonWrapper.MedicationCodeableConcept>();
        Map<String,PLM_JsonWrapper.InformationSource> informationSourceMap = new Map<String,PLM_JsonWrapper.InformationSource>();
        Map<String,PLM_JsonWrapper.EffectivePeriod> effectivePeriodMap = new Map<String,PLM_JsonWrapper.EffectivePeriod>();
        Map<String,PLM_JsonWrapper.VaccineCode> vaccineCodeMap = new Map<String,PLM_JsonWrapper.VaccineCode>();
        Map<String,PLM_JsonWrapper.Manufacturer> manufacturerMap = new Map<String,PLM_JsonWrapper.Manufacturer>();                
        Map<String,PLM_JsonWrapper.Context> contextMap = new Map<String,PLM_JsonWrapper.Context>();        
        Map<String,PLM_JsonWrapper.ServiceProvider> serviceProviderMap = new Map<String,PLM_JsonWrapper.ServiceProvider>();
        Map<String,PLM_JsonWrapper.Period> periodMap = new Map<String,PLM_JsonWrapper.Period>();
        Map<String,PLM_JsonWrapper.Subject> subjectMap = new Map<String,PLM_JsonWrapper.Subject>();
        Map<String,PLM_JsonWrapper.Class_x> classMap = new Map<String,PLM_JsonWrapper.Class_x>();
        
        Map<String,List<PLM_JsonWrapper.Category>> categoryMap = new Map<String,List<PLM_JsonWrapper.Category>>();
        Map<String,List<PLM_JsonWrapper.Dosage>> dosageMap = new Map<String,List<PLM_JsonWrapper.Dosage>>();
        Map<String,List<PLM_JsonWrapper.Reaction>> reactionMap = new Map<String,List<PLM_JsonWrapper.Reaction>>();
        Map<String,List<PLM_JsonWrapper.ReferenceRange>> referenceRangeMap = new Map<String,List<PLM_JsonWrapper.ReferenceRange>>();
        Map<String,List<PLM_JsonWrapper.Interpretation>> interpretationMap = new Map<String,List<PLM_JsonWrapper.Interpretation>>();
        Map<String,List<PLM_JsonWrapper.Performer>> performerMap = new Map<String,List<PLM_JsonWrapper.Performer>>();
        Map<String,List<PLM_JsonWrapper.Note>> noteMap = new Map<String,List<PLM_JsonWrapper.Note>>();
        Map<String,List<PLM_JsonWrapper.Extension>> extensionMap = new Map<String,List<PLM_JsonWrapper.Extension>>();
        
        Map<String,Map<PLM_JsonWrapper.Identifier,Patient__c>> identifierMap = new Map<String,Map<PLM_JsonWrapper.Identifier,Patient__c>>();
        Map<String,Map<PLM_JsonWrapper.Identifier,Encounter__c>> identifierEncounterMap = new Map<String,Map<PLM_JsonWrapper.Identifier,Encounter__c>>();
        Map<String,Map<PLM_JsonWrapper.Identifier,Asserter__c>> identifierAsserterMap = new Map<String,Map<PLM_JsonWrapper.Identifier,Asserter__c>>();
        Map<String,Map<PLM_JsonWrapper.Identifier,Information_Source__c>> identifierInformationSourceMap = new Map<String,Map<PLM_JsonWrapper.Identifier,Information_Source__c>>();
        Map<String,Map<PLM_JsonWrapper.Identifier,Subject__c>> identifierSubjectMap = new Map<String,Map<PLM_JsonWrapper.Identifier,Subject__c>>();
        Map<String,Map<PLM_JsonWrapper.Identifier,Manufacturer__c>> identifierManufacturerMap = new Map<String,Map<PLM_JsonWrapper.Identifier,Manufacturer__c>>();
        
        Map<String,Map<Type__c,Identifier_Custom__c>> typeMap = new Map<String,Map<Type__c,Identifier_Custom__c>>();
        Map<String,Map<List<PLM_JsonWrapper.DoseAndRate>,Dosage__c>> doseAndRateDosageMap = new Map<String,Map<List<PLM_JsonWrapper.DoseAndRate>,Dosage__c>>();
        Map<List<PLM_JsonWrapper.Coding>,VaccineCode__c> CodingVaccineMap = new Map<List<PLM_JsonWrapper.Coding>,VaccineCode__c>();
        
        List<Resource__c> resourceList = new List<Resource__c>();
        for(Entry__c entry:entrylist){
            for(String fullURL:resourceMap.keySet()){
                if(fullURL == entry.Full_URL__c){
                    PLM_JsonWrapper.Resource wrapperResource = resourceMap.get(fullURL);
                    Resource__c resource = new Resource__c();
                    resource.Entry__c = entry.Id;
                    resource.Type__c = (wrapperResource.type!=null)?wrapperResource.type :null;
                    resource.Resource_Type__c = (wrapperResource.resourceType!=null)?wrapperResource.resourceType :null;
                    resource.Id__c =(wrapperResource.id!=null)?wrapperResource.id :null;
                    resource.LastOccurence__c =(wrapperResource.lastOccurrence!=null)?wrapperResource.lastOccurrence :null;
                    resource.Onset_Datetime__c =(wrapperResource.onsetDateTime!=null)?wrapperResource.onsetDateTime :null;
                    resource.Effective_DateTime__c = (wrapperResource.effectiveDateTime!=null)?wrapperResource.effectiveDateTime :null;
                    resource.Status__c = (wrapperResource.status!=null)?wrapperResource.status :null;
                    resource.ValueString__c = (wrapperResource.valueString!=null)?wrapperResource.valueString :null;
                    resource.Occurence_DateTime__c = (wrapperResource.occurrenceDateTime!=null)?wrapperResource.occurrenceDateTime :null;                   
                    resourceList.add(resource);
                    
                    if(wrapperResource.patient!=null){
                        patientMap.put(resource.Id__c ,wrapperResource.patient);  
                    }
                    if(wrapperResource.clinicalStatus!=null){
                        clinicalStatusMap.put(resource.Id__c ,wrapperResource.clinicalStatus);  
                    }
                    /*if(wrapperResource.encounter!=null){
                        encounterMap.put(resource.Id__c ,wrapperResource.encounter);  
                    }
                    if(wrapperResource.meta!=null){
                        metaMap.put(resource.Id__c ,wrapperResource.meta);  
                    }
                    if(wrapperResource.asserter!=null){
                        asserterMap.put(resource.Id__c ,wrapperResource.asserter);  
                    }
                    if(wrapperResource.code!=null){
                        codeMap.put(resource.Id ,wrapperResource.code);  
                    }                   
                    if(wrapperResource.medicationCodeableConcept!=null){
                        medicationMap.put(resource.Id__c ,wrapperResource.medicationCodeableConcept);  
                    }
                    if(wrapperResource.informationSource!=null){
                        informationSourceMap.put(resource.Id__c ,wrapperResource.informationSource);  
                    }
                    if(wrapperResource.effectivePeriod!=null){
                        effectivePeriodMap.put(resource.Id__c ,wrapperResource.effectivePeriod);  
                    }
                    
                    if(wrapperResource.vaccineCode!=null){
                        vaccineCodeMap.put(resource.Id__c ,wrapperResource.vaccineCode);  
                    }
                    if(wrapperResource.manufacturer!=null){
                        manufacturerMap.put(resource.Id__c ,wrapperResource.manufacturer);  
                    }
                    if(wrapperResource.dosage!=null){
                        dosageMap.put(resource.Id__c ,wrapperResource.dosage);  
                    }
                    if(wrapperResource.context!=null){
                        contextMap.put(resource.Id__c ,wrapperResource.context);  
                    }
                    if(wrapperResource.category!=null){
                        categoryMap.put(resource.Id__c ,wrapperResource.category);  
                    }
                    if(wrapperResource.serviceProvider!=null){
                        serviceProviderMap.put(resource.Id__c ,wrapperResource.serviceProvider);  
                    }
                    if(wrapperResource.period!=null){
                        periodMap.put(resource.Id__c ,wrapperResource.period);  
                    }
                    if(wrapperResource.subject!=null){
                        subjectMap.put(resource.Id__c ,wrapperResource.subject);  
                    }
                    if(wrapperResource.class_y!=null){
                        classMap.put(resource.Id__c ,wrapperResource.class_y);  
                    }
                    //list of objects
                    if(wrapperResource.reaction!=null){
                        reactionMap.put(resource.Id__c ,wrapperResource.reaction);  
                    }
                    if(wrapperResource.referenceRange!=null){
                        referenceRangeMap.put(resource.Id__c ,wrapperResource.referenceRange);  
                    }
                    if(wrapperResource.interpretation!=null){
                        interpretationMap.put(resource.Id__c ,wrapperResource.interpretation);  
                    }
                    if(wrapperResource.performer!=null){
                        performerMap.put(resource.Id__c ,wrapperResource.performer);  
                    }
                    if(wrapperResource.note!=null){
                        noteMap.put(resource.Id__c ,wrapperResource.note);  
                    }
                    if(wrapperResource.extension!=null){
                        extensionMap.put(resource.Id__c ,wrapperResource.extension);  
                    }*/
                    
                }
            }
        }
        insert resourceList;
        List<Patient__c> patientsList = new List<Patient__c>();
       // system.debug('patientMap::::::::'+patientMap.size());
        if(patientMap.size()>0){
            //system.debug('if:insidepatientMap::::::::::'+patientMap);
            for(Resource__c res:resourceList){
              //  system.debug('res:::::::'+res);
                for(String id:patientMap.keySet()){
                   // system.debug('inner for res::::'+patientMap.keySet());
                    
                    if(id == res.Id__c){
                        PLM_JsonWrapper.Patient wrapperPatient = patientMap.get(id); 
                        Patient__c patients = new Patient__c();
                        patients.Type__c=wrapperPatient.type; 
                        patients.Resource__c = res.Id;
                        patientsList.add(patients);
                       // system.debug('res.Id:::::'+res.Id);
                        if(wrapperPatient.identifier!=null){
                            identifierMap.put(wrapperPatient.identifier.system_x ,new Map<PLM_JsonWrapper.Identifier,Patient__c>{wrapperPatient.identifier=> patients});  
                        }  
                    }
                }
            }  
            
        }
        insert patientsList;
       // system.debug('patientsList'+patientsList);
        List<Identifier_Custom__c> identifyList = new List<Identifier_Custom__c>();
        if(identifierMap.size()>0){            
            for(string system_x :identifierMap.keyset() ){
                Map<PLM_JsonWrapper.Identifier,Patient__c> wrapperidentifierMap = identifierMap.get(system_x);
                for( PLM_JsonWrapper.Identifier  identifier: wrapperidentifierMap.keyset()){
                    Identifier_Custom__c identify = new Identifier_Custom__c();
                    identify.Value__c = identifier.value;
                    Patient__c patientidentifier = wrapperidentifierMap.get(identifier);
                    identify.Patient__c =patientidentifier.Id;
                    //Type__c  type = new Type__c();
                   // typeMap.put(identifier.system_x,(new Map<Type__c,Identifier_Custom__c>{type =>identify}));
                    identifyList.add(identify);
                }                
            }
        }
        insert identifyList;
       /* List<Type__c> typesList = new List<Type__c>();
        for(String system_x:typeMap.keySet()){
            Map<Type__c,Identifier_Custom__c> m = typeMap.get(system_x);
            for(Type__c type:m.keySet()){
                type.id = 'test';//PLM_JsonWrapper.Text.id;
                type.Identifier__c = m.get(type).id;
                typesList.add(type);
            }
        }
        insert typesList; */
        List<Clinical_status__c> clinicalList= new List<Clinical_status__c>();
        if(clinicalStatusMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id:clinicalStatusMap.keySet()){
                    if(id == res.Id__c){  
                        PLM_JsonWrapper.ClinicalStatus wrapperClinicalStatus=clinicalStatusMap.get(id);
                        Clinical_status__c clinical= new Clinical_status__c();
                        clinical.Text__c = wrapperClinicalStatus.value;
                        clinical.Resource__c = res.Id;
                        clinicalList.add(clinical);
                    }
                }
            }            
        } 
        insert clinicalList;
        List<Encounter__c> encounterList= new List<Encounter__c>();
        if(encounterMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id:encounterMap.keySet()){
                    if(id == res.Id__c){  
                        PLM_JsonWrapper.Encounter wrapperEncounter=encounterMap.get(id);
                        Encounter__c encounter= new Encounter__c();
                        encounter.Type__c = wrapperEncounter.type;
                        encounter.Resource__c = res.Id;
                        encounterList.add(encounter);
                        if(wrapperEncounter.identifier!=null){
                            identifierEncounterMap.put(wrapperEncounter.identifier.system_x,new Map<PLM_JsonWrapper.Identifier,Encounter__c>{wrapperEncounter.identifier=> encounter});  
                        }
                    }
                }
            }            
        }
        insert encounterList;
        List<Identifier_Custom__c> identifyListEncounter = new List<Identifier_Custom__c>();
        if(identifierEncounterMap.size()>0){            
            for(string system_x :identifierEncounterMap.keyset() ){
                Map<PLM_JsonWrapper.Identifier,Encounter__c> wrapperidentifierMap = identifierEncounterMap.get(system_x);
                for( PLM_JsonWrapper.Identifier  identifier: wrapperidentifierMap.keyset()){
                    Identifier_Custom__c identify = new Identifier_Custom__c();
                    identify.Value__c = identifier.value;
                    Encounter__c encounterIdentifier = wrapperidentifierMap.get(identifier);
                    identify.Encounter__c =encounterIdentifier.Id;
                    identifyListEncounter.add(identify);
                }                
            }
            
        }
        insert identifyListEncounter;
        List<Meta__c> metaobjList = new List<Meta__c>();
        if(metaMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id:metaMap.keySet()){
                    if(id == res.Id__c){  
                        PLM_JsonWrapper.Meta wrapperMetaMap=metaMap.get(id);
                        Meta__c metaobj = new Meta__c();
                        metaobj.Source__c = wrapperMetaMap.source;
                        metaobj.Resource__c = res.Id;
                        metaobjList.add(metaobj);
                    }
                }
            }
        } 
        insert metaobjList;
        List<Asserter__c> asserterList = new List<Asserter__c>();
        if(asserterMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id:asserterMap.keySet()){
                    if(id == res.Id__c){  
                        PLM_JsonWrapper.Asserter wrapperAsserter = asserterMap.get(id);
                        Asserter__c asserter = new Asserter__c();
                        asserter.Type__c = wrapperAsserter.type;
                        asserter.Resource__c = res.Id;
                        asserterList.add(asserter);
                        if(wrapperAsserter.identifier!=null){
                            identifierAsserterMap.put(wrapperAsserter.identifier.system_x,new Map<PLM_JsonWrapper.Identifier,Asserter__c>{wrapperAsserter.identifier=> asserter});  
                        }
                    }
                }
            }
            
        } 
        insert asserterList;
        List<Identifier_Custom__c> identifyListAsserter = new List<Identifier_Custom__c>();
        if(identifierAsserterMap.size()>0){            
            for(string system_x :identifierAsserterMap.keyset() ){
                Map<PLM_JsonWrapper.Identifier,Asserter__c> wrapperidentifierMap = identifierAsserterMap.get(system_x);
                for( PLM_JsonWrapper.Identifier  identifier: wrapperidentifierMap.keyset()){
                    Identifier_Custom__c identify = new Identifier_Custom__c();
                    identify.Value__c = identifier.value;
                    Asserter__c asserterIdentifier = wrapperidentifierMap.get(identifier);
                    identify.Asserter__c =asserterIdentifier.Id;
                    identifyListAsserter.add(identify);
                }                
            }
            
        }
        insert identifyListAsserter;
        List<Code__c> codeList = new  List<Code__c>();
        if(codeMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id:codeMap.keySet()){
                    if(id == res.Id__c){  
                        PLM_JsonWrapper.Code wrapperCodeMap=codeMap.get(id);
                        Code__c code = new Code__c();
                        code.Text__c = wrapperCodeMap.text;
                        code.Resource__c = res.Id;
                        codeList.add(code);
                    }
                }
            }
        }
        insert codeList;
        List<Medication_Codable_Concept__c> medicationList = new List<Medication_Codable_Concept__c>();
        
        if(medicationMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: medicationMap.keySet()){
                    if(id == res.Id__c){
                        PLM_JsonWrapper.MedicationCodeableConcept wrapperMedicationMap =  medicationMap.get(id);
                        Medication_Codable_Concept__c medication = new 	Medication_Codable_Concept__c();
                        medication.Text__c=wrapperMedicationMap.text ;
                        medication.Resource__c = res.Id;
                        medicationList.add(medication);
                    }
                }
            }
        }
        insert medicationList;
        
        List<Information_Source__c> informationSourceList = new List<Information_Source__c>();       
        if(informationSourceMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: informationSourceMap.keySet()){
                    if(id == res.Id__c){
                        PLM_JsonWrapper.InformationSource wrapperinformationSource =  informationSourceMap.get(id);
                        Information_Source__c informationSource = new Information_Source__c();
                        informationSource.Type__c=wrapperinformationSource.type ;
                        informationSource.Resource__c = res.Id;
                        informationSourceList.add(informationSource);
                        if(wrapperinformationSource.identifier!=null){
                            identifierInformationSourceMap.put(wrapperinformationSource.identifier.system_x,new Map<PLM_JsonWrapper.Identifier,Information_Source__c>{wrapperinformationSource.identifier =>informationSource}); 
                        }
                    }
                }
            }
            
        }
        insert informationSourceList;
        List<Identifier_Custom__c> identifyListinfo = new List<Identifier_Custom__c>();
        if(identifierInformationSourceMap.size()>0){            
            for(string system_x :identifierInformationSourceMap.keyset() ){
                Map<PLM_JsonWrapper.Identifier,Information_Source__c> wrapperidentifierMap = identifierInformationSourceMap.get(system_x);
                for( PLM_JsonWrapper.Identifier  identifier: wrapperidentifierMap.keyset()){
                    Identifier_Custom__c identify = new Identifier_Custom__c();
                    identify.Value__c = identifier.value;
                    Information_Source__c informationSourceidentifier = wrapperidentifierMap.get(identifier);
                    identify.Information_Source__c =informationSourceidentifier.Id;
                    identifyListinfo.add(identify);
                }                
            }
            
        }
        insert identifyListinfo;
        List<Effective_Period__c> effectivePeriodList = new List<Effective_Period__c>();
        
        if(effectivePeriodMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: effectivePeriodMap.keySet()){
                    if(id == res.Id__c){
                        PLM_JsonWrapper.EffectivePeriod wrapperEffectivePeriod =  effectivePeriodMap.get(id);
                        Effective_Period__c effectivePeriod = new Effective_Period__c();
                        effectivePeriod.Start__c=wrapperEffectivePeriod.start ;
                        effectivePeriod.Resource__c = res.Id;
                        effectivePeriodList.add(effectivePeriod);
                    }
                }
            }            
        }
        insert effectivePeriodList;
        List<VaccineCode__c> vaccineCodeList = new List<VaccineCode__c>();
        if(vaccineCodeMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: vaccineCodeMap.keySet()){
                    if(id == res.Id__c){
                        PLM_JsonWrapper.VaccineCode wrapperVaccineCode =  vaccineCodeMap.get(id);
                        VaccineCode__c vaccineCode = new VaccineCode__c();
                        vaccineCode.Text__c = wrapperVaccineCode.text;
                        vaccineCode.Resource__c = res.Id;
                        vaccineCodeList.add(vaccineCode);
                        // if(wrapperVaccineCode.coding!=null){
                        //   CodingVaccineMap.put(wrapperVaccineCode.coding,vaccineCode);
                        // }
                    }
                }
            }   
            
        }
        insert vaccineCodeList;
        List<Manufacturer__c> manufacturerList = new List<Manufacturer__c>();
        if(manufacturerMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: manufacturerMap.keySet()){
                    if(id == res.Id__c){
                        PLM_JsonWrapper.Manufacturer wrappeManufacturer =  manufacturerMap.get(id);
                        Manufacturer__c manufacturer = new Manufacturer__c();
                        manufacturer.Type__c = wrappeManufacturer.type;
                        manufacturer.Resource__c = res.Id; 
                        manufacturerList.add(manufacturer);
                        if(wrappeManufacturer.identifier!= null){
                            identifierManufacturerMap.put(wrappeManufacturer.identifier.system_x,new Map<PLM_JsonWrapper.Identifier,Manufacturer__c>{wrappeManufacturer.identifier => manufacturer});
                        }
                    }
                }
            }  
            
        }
        insert manufacturerList;
        List<Identifier_Custom__c> identifyListManufacturer = new List<Identifier_Custom__c>();
        if(identifierManufacturerMap.size()>0){            
            for(string system_x :identifierManufacturerMap.keyset() ){
                Map<PLM_JsonWrapper.Identifier,Manufacturer__c> wrapperidentifierMap = identifierManufacturerMap.get(system_x);
                for( PLM_JsonWrapper.Identifier  identifier: wrapperidentifierMap.keyset()){
                    Identifier_Custom__c identify = new Identifier_Custom__c();
                    identify.Value__c = identifier.value;
                    Manufacturer__c manufacturerIdentifier = wrapperidentifierMap.get(identifier);
                    identify.Patient__c =manufacturerIdentifier.Id;
                    identifyListManufacturer.add(identify);
                }                
            }
           
        }
         insert identifyListManufacturer;
        List<Dosage__c> dosageList = new List<Dosage__c>();
        if(dosageMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: dosageMap.keySet()){
                    if(id == res.Id__c){
                        List<PLM_JsonWrapper.Dosage> wrapperdosageList =  dosageMap.get(id);
                        for(PLM_JsonWrapper.Dosage wrapperdosage: wrapperdosageList){
                            Dosage__c dosage = new Dosage__c();
                            dosage.Resource__c = res.Id;
                            dosageList.add(dosage);
                        }
                        //if(wrapperdosage.doseandrate!=null){
                        //    doseAndRateDosageMap.put(wrapperdosage.doseandrate. ,Map<List<PLM_JsonWrapper.DoseAndRate>,Dosage__c>{wrapperdosage.doseandrate=> dosage});
                        // }
                    }
                }
            } 
            
        }
        insert dosageList;
        List<Context__c> contextList = new List<Context__c>();
        if(contextMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: contextMap.keySet()){
                    if(id == res.Id__c){
                        PLM_JsonWrapper.Context wrappeContext =  contextMap.get(id);
                        Context__c context = new Context__c();
                        context.Resource__c = res.Id; 
                        contextList.add(context);
                    }
                }
            } 
            
        }
        insert contextList;
        List<Category__c> categoryList = new List<Category__c>();        
        if(categoryMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: categoryMap.keySet()){
                    if(id == res.Id__c){
                        List<PLM_JsonWrapper.Category> wrappecategoryList =  categoryMap.get(id);
                        for(PLM_JsonWrapper.Category wrappecategory: wrappecategoryList){
                            Category__c category = new Category__c();
                            category.Resource__c = res.Id; 
                            categoryList.add(category);
                        }
                    }
                }
            }            
        }
        insert categoryList;
        List<ServiceProvider__c> serviceProviderList = new List<ServiceProvider__c>();
        if(serviceProviderMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: serviceProviderMap.keySet()){
                    if(id == res.Id__c){
                        PLM_JsonWrapper.ServiceProvider wrappeserviceProvider =  serviceProviderMap.get(id);
                        ServiceProvider__c serviceProvider = new ServiceProvider__c();
                        serviceProvider.Resource__c = res.Id; 
                        serviceProviderList.add(serviceProvider);
                    }
                }
            }  
            
        }
        insert serviceProviderList;
        List<Period__c> periodList = new List<Period__c>();
        if(periodMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: periodMap.keySet()){
                    if(id == res.Id__c){
                        PLM_JsonWrapper.Period wrappePeriod =  periodMap.get(id);
                        Period__c period = new Period__c();
                        period.Start__c = wrappePeriod.start;
                        period.End__c =wrappePeriod.end_x;
                        period.Resource__c = res.Id;
                        periodList.add(period);
                    }
                }
            } 
            
        }
        insert periodList;
        List<Subject__c> subjectList = new List<Subject__c>();        
        if(subjectMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: subjectMap.keySet()){
                    if(id == res.Id__c){
                        PLM_JsonWrapper.Subject wrappeSubject =  subjectMap.get(id);
                        Subject__c subject = new Subject__c();
                        subject.Type__c = wrappeSubject.type;
                        subject.Resource__c = res.Id; 
                        subjectList.add(subject);
                        if(wrappeSubject.identifier!=null){
                            
                        }
                    }
                }
            }  
            
        }
        insert subjectList;
        List<Identifier_Custom__c> identifyListSub = new List<Identifier_Custom__c>();
        if(identifierSubjectMap.size()>0){            
            for(string system_x :identifierSubjectMap.keyset() ){
                Map<PLM_JsonWrapper.Identifier,Subject__c> wrapperidentifierMap = identifierSubjectMap.get(system_x);
                for( PLM_JsonWrapper.Identifier  identifier: wrapperidentifierMap.keyset()){
                    Identifier_Custom__c identify = new Identifier_Custom__c();
                    identify.Value__c = identifier.value;
                    Subject__c subjectIdentifier = wrapperidentifierMap.get(identifier);
                    identify.Subject__c =subjectIdentifier.Id;
                    identifyListSub.add(identify);
                }                
            }
            
        }
        insert identifyListSub;
        List<Class__c> classList = new List<Class__c>();
        if(classMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: classMap.keySet()){
                    if(id == res.Id__c){
                        PLM_JsonWrapper.Class_x wrappeClass = classMap.get(id);
                        Class__c clas = new Class__c();
                        clas.Display__c = wrappeClass.display;
                        clas.Resource__c = res.Id; 
                        classList.add(clas);
                    }
                }
            } 
            
        }
        insert classList;
        //############### 
        List<Reaction__c> reactionList = new List<Reaction__c>();
        if(reactionMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: reactionMap.keySet()){
                    if(id == res.Id__c){
                        List<PLM_JsonWrapper.Reaction> wrapperReactionList =  reactionMap.get(id);
                        for(PLM_JsonWrapper.Reaction wrapperReaction : wrapperReactionList){
                            Reaction__c reaction = new Reaction__c();
                            reaction.Resource__c = res.Id;
                            reactionList.add(reaction);
                        }
                    }
                }
            }  
            
        }
        insert reactionList;
        List<Reference_Range__c> referenceRangeList = new List<Reference_Range__c>();
        if(referenceRangeMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: referenceRangeMap.keySet()){
                    if(id == res.Id__c){
                        List<PLM_JsonWrapper.ReferenceRange> wrapperReactionList =  referenceRangeMap.get(id);
                        for(PLM_JsonWrapper.ReferenceRange wrapperReaction:wrapperReactionList){
                            Reference_Range__c referenceRange = new Reference_Range__c();
                            referenceRange.Text__c = wrapperReaction.text;
                            referenceRange.Resource__c = res.Id;
                            
                            referenceRangeList.add(referenceRange);
                        }
                    }
                }
            }  
            
        }
        insert referenceRangeList;
        List<Interpretation__c> interpretationList = new List<Interpretation__c>();
        if(interpretationMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: interpretationMap.keySet()){
                    if(id == res.Id__c){
                        List<PLM_JsonWrapper.Interpretation> wrapperInterpretationList =  interpretationMap.get(id);
                        for(PLM_JsonWrapper.Interpretation wrapperinterpretation:wrapperInterpretationList){
                            Interpretation__c interpretation = new Interpretation__c();
                            interpretation.Text__c = wrapperinterpretation.text;
                            interpretation.Resource__c = res.Id;                        
                            interpretationList.add(interpretation);
                        }
                    }
                }
            }  
            
        } 
        insert interpretationList;
        List<Performer__c> performerList = new List<Performer__c>();
        if(performerMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: performerMap.keySet()){
                    if(id == res.Id__c){
                        List<PLM_JsonWrapper.Performer> wrapperPerformerList =  performerMap.get(id);
                        for(PLM_JsonWrapper.Performer wrapperPerformer:wrapperPerformerList){
                            Performer__c performer = new Performer__c();
                            performer.Type__c = wrapperPerformer.type;
                            performer.Resource__c = res.Id;                        
                            performerList.add(performer);
                            
                            
                        }
                    }
                }
            }  
            
        } 
        insert performerList;
        List<Note__c> noteList = new List<Note__c>();
        if(noteMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: noteMap.keySet()){
                    if(id == res.Id__c){
                        List<PLM_JsonWrapper.Note> wrapperNoteList =  noteMap.get(id);
                        for(PLM_JsonWrapper.Note wrapperNote : wrapperNoteList){
                            Note__c note = new Note__c();
                            note.Text__c = wrapperNote.text;
                            note.Resource__c = res.Id;                        
                            noteList.add(note);
                        }
                    }
                }
            }  
            
        }
         insert noteList;
        List<Extension__c> extensionList = new List<Extension__c>();
        if(extensionMap.size()>0){
            for(Resource__c res:resourceList){
                for(String id: extensionMap.keySet()){
                    if(id == res.Id__c){
                        List<PLM_JsonWrapper.Extension> wrapperExtensionList = extensionMap.get(id);
                        for(PLM_JsonWrapper.Extension wrapperExtension : wrapperExtensionList){
                            Extension__c extension = new Extension__c();
                            extension.URL__c = wrapperExtension.url;
                            extension.Value_Instant__c = wrapperExtension.valueInstant;
                            extension.Resource__c = res.Id;                        
                            extensionList.add(extension);
                        }
                    }
                }
            }  
             
        }
        insert extensionList;
    }   
}