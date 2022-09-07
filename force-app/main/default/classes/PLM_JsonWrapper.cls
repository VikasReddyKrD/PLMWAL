public class PLM_JsonWrapper{
	
	public String resourceType {get;set;}
	public String type {get;set;}
	public Meta meta {get;set;} 
	public List<Entry> entry {get;set;} 
	public String total {get;set;}
	public List<Link> link {get;set;}
	
	public class Link{
		public String relation {get;set;}
		public String url {get;set;}
	}
	public class Meta{
        public string source;
		public string versionId {get;set;}
		public String lastUpdated {get;set;}
		public List<Extension> extension {get;set;}
	} 
	public class Entry{
		public Resource resource {get;set;}
		public List<Link> link {get;set;}
		public String fullUrl {get;set;}
	}
	public class Resource{
        public String id {get;set;}
		public String resourceType {get;set;}
        public string onsetDateTime;
        public string valueString;
        public String type;
        public String lastOccurrence;
        public string effectiveDateTime;
        public string status;
        public string occurrenceDateTime;
        
		public List<Identifier> identifier {get;set;}
		
		public Meta meta {get;set;}
		public List<Extension> extension {get;set;}
        public Patient patient;
        
        public ClinicalStatus clinicalStatus;
        public Encounter encounter; //c                    
        public Asserter asserter;
        
        Public Code code;
        Public MedicationCodeableConcept medicationCodeableConcept;        
        public InformationSource informationSource;   //c     
        
        public EffectivePeriod effectivePeriod;//c
        public VaccineCode vaccineCode;
        public Manufacturer manufacturer; //c
        public List<Dosage> dosage;
        public Context context;//c
        public List<Category> category;
        public ServiceProvider serviceProvider;//c
        public Period period; //c        
        public Subject subject;//c 
        public Class_x class_y;//c
        
        public List<Reaction> reaction;
        public List<ReferenceRange> referenceRange;//c
        public List<Interpretation> interpretation; 
        public List<Performer> performer;
        Public List<Note> note;
        
	}
    public class Note{
        public String text; 
    }
    
    public class Performer{
        public string type;
        public Identifier identifier {get;set;}
        public Onbehalfof onbehalfof;
        public Actor actor;
    }
    public class Actor{
        public string type; 
        public Identifier identifier;
    }
    public class Onbehalfof {
        public string type;
        public Identifier identifier;
    }
     public class Interpretation{
        public string text; 
    }
    public class ReferenceRange{
        public string text;
    }
    public class Reaction {
        public List<Manifestation> manifestation;
    }
    public class Manifestation{
        public string text;
        public List<Coding> coding;        
    }
    public Class Class_x{
        public string display;
    }
    public class Period{
        public string end_x;
        public string start;
    }
    public class Subject{
        public string type;
        public Identifier identifier;
    }
    public class ServiceProvider{
        public string type;
    }
    public class Category{
        public List<Coding> coding;
        
    }
    public class Context{
        public string type; 
    }
    public class Dosage{
        public  List<DoseAndRate> doseandrate;
    }
    public class DoseAndRate{
        public DoseQuantity doseQuantity;
    }
    public class DoseQuantity{
        public string value;
        
    }
    Public class InformationSource{
        public String type;
        public Identifier identifier;
    }
     public class Manufacturer{
        public string type;
        public Identifier identifier {get;set;} 
        
    }
    public class EffectivePeriod{
        public  String start;
    }
    public class VaccineCode{
        public string text;
        public List<Coding> coding;
    }
     Public class MedicationCodeableConcept {
        public string text;
        public List<Coding> coding;
        
    }
    Public class Code{
        public string text;
        public List<Coding> coding;
    }
    public class Asserter{
        public string type; 
        public Identifier identifier;
    }    
    public class Encounter{
        public string type;
        public Identifier identifier;
        
    }
    public class ClinicalStatus{
        public string value;
        public string text;
        public List<Coding> coding;        
    }
    public class Coding{
        public String code;
        public String system_x;
        public string display; 
    } 
     public class Patient{
        public string type;
        public Identifier Identifier;       
    }
    
	public class Identifier{
		public Type type {get;set;}
		public String value {get;set;}
		public String system_x {get;set;}
	}
	public class Type{
		public String id {get;set;}
	}
	public class Extension{
		public String url {get;set;}
		public ValueReference valueReference {get;set;}
		public String valueInstant {get;set;}
	}
	public class ValueReference{
		public Identifier identifier {get;set;}
	}
    
    
}