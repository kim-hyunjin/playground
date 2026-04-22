protocol AdvancedLifeSupport {
    func performCPR()
}

class EmergencyRoom {
    var delegate: AdvancedLifeSupport?
    
    func assessSituation() {
        print("Can you tell me what happened?")
    }
    
    func medicalEmergency() {
        delegate?.performCPR()
    }

}
    
struct Paramedic: AdvancedLifeSupport {
    
    init(emergencyRoom: EmergencyRoom) {
        emergencyRoom.delegate = self
    }
    
    func performCPR() {
        print("Paramedic performs CPR")
    }
}

let emergencyRoom = EmergencyRoom()
let kim = Paramedic(emergencyRoom: emergencyRoom)

emergencyRoom.assessSituation()
emergencyRoom.medicalEmergency()

class Doctor: AdvancedLifeSupport {
    
    init(emergencyRoom: EmergencyRoom) {
        emergencyRoom.delegate = self
    }
    
    func performCPR() {
        print("Doctor performs CPR")
    }
}

class Surgeon: Doctor {
    override func performCPR() {
        print("Surgeon performs CPR")
    }
}

let angela = Doctor(emergencyRoom: emergencyRoom)
emergencyRoom.assessSituation()
emergencyRoom.medicalEmergency()

let jimmy = Surgeon(emergencyRoom: emergencyRoom)
emergencyRoom.assessSituation()
emergencyRoom.medicalEmergency()
