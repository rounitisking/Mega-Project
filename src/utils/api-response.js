class apiResponse{

    constructor(statuscode , msg ="success" , data){
        this.statuscode =  statuscode
        this.msg = msg
        this.data = data
        this.success = statuscode < 400
    }
}

export {apiResponse}