class apiResponse{

    constructor(statuscode , data, msg ="success" ){
        this.statuscode =  statuscode
        this.msg = msg
        this.data = data
        this.success = statuscode < 400
    }
}

export default apiResponse