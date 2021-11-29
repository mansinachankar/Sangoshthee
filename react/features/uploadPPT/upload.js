import React, { Component } from "react";
import axios from 'axios';
import { Dialog } from "../base/dialog";

export default class UploadPPT extends Component<Props> {

    constructor(props: Props) {
        super(props);

        this.state = {
            data: "",
            selectedFile: "",
            buttonVal: false,
            isLoading: false,
        }

        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    // on file select (from pop up)
    onFileChange = event => {
        const file = event.target.files[0];
        const fileName = file.name;
        
        if(fileName.indexOf(' ') >= 1) {
            console.log('name has white space');
            this.setState({ data: "File Name Should not contain White Space" });
            this.setState({ buttonVal: true });
        } else {
            console.log('File Name does not have White Space')
            if(file.size > 209715200) {
                this.setState({ data: "File Size Limit Exceed" });
            } else {
                this.setState({ data: "" });
                this.setState({ selectedFile: event.target.files[0] });
                this.setState({ buttonVal: false });
            }
        }

        console.log('last line of onFileChange Function');
    }

    //on click of upload button
    onSubmit = () => {
        // object for form data
        const formData = new FormData();
        this.setState({ isLoading: true });
        // isLoading = true;

        // API request
        const url = "https://sangoshthee.cdac.in/FileUploadService";

        var meetingURL = window.location.href;
        var splittedMeetingURL = meetingURL.split("/");
        var meetingName = splittedMeetingURL[3];

        //updating form data
        formData.append( "username", meetingName);
        formData.append( "sampleFile", this.state.selectedFile);

        //cors
        var axiosConfig =  {
            headers : {
                "Access-Control-Allow-Origin": "*",
            }
        };

        axios.post(url, formData, axiosConfig).then((response) => {
            this.setState({ data: response.data.msg, isLoading: false }); 
            console.log(response.data);
        }).catch((err) => {
            this.setState( { data: "Error in Uploading Presentation", isLoading: false });
            console.log(err);
        });
        console.log('last line of onSubmit function');
    };

    render() {
        console.log(this.state.isLoading);
        let isLoadingStatus = this.state.isLoading;
        let displayLoadingStatus;
        if(isLoadingStatus) {
            displayLoadingStatus = " Uploading ..... ";
        } else {
            displayLoadingStatus = "";
        }
        return (
            <Dialog
                okKey="Upload"
                okDisabled = { this.state.buttonVal }
                onSubmit={this.onSubmit}
                titleKey="Please Upload Presentation"
                width="small"
            >
                <div>
                    <input type="file" name="sampleFile" accept=".ppt, .pptx" className="form-control" onChange={ this.onFileChange }/>
                </div>
                <div>
                    <br />
                    <p>{displayLoadingStatus}</p>
                    <p>{this.state.data}</p>
                </div>
            </Dialog>
        );
    }
}
