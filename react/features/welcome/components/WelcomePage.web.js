/* global interfaceConfig */
import  * as React from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { isMobileBrowser } from '../../base/environment/utils';
import { translate, translateToHTML } from '../../base/i18n';
import { Icon, IconWarning } from '../../base/icons';
import { Watermarks } from '../../base/react';
import { connect } from '../../base/redux';
import { CalendarList } from '../../calendar-sync';
import { RecentList } from '../../recent-list';
import { SettingsButton, SETTINGS_TABS } from '../../settings';
import { AbstractWelcomePage, _mapStateToProps } from './AbstractWelcomePage';
import Tabs from './Tabs';
import Settings from '@material-ui/icons/Settings';
import DescriptionIcon from '@material-ui/icons/Description';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import '../css/style.css';
import '../css/aos.css';




/**
* The pattern used to validate room name.
* @type {string}
*/
export const ROOM_NAME_VALIDATE_PATTERN_STR = '^[^?&:\u0022\u0027%#]+$';
const CONFERENCES_PARTICIPANTS_COUNT_URL =
"https://sangoshthee.cdac.in/getdata/";
/**
* The Web container rendering the welcome page.
*
* @extends AbstractWelcomePage
*/
class WelcomePage extends AbstractWelcomePage {
/**
* Default values for {@code WelcomePage} component's properties.
*
* @static
*/
static defaultProps = {
_room: ''
};

/**
* Initializes a new WelcomePage instance.
*
* @param {Object} props - The read-only properties with which the new
* instance is to be initialized.
*/
constructor(props) {

super(props);
this.dialogClose = () => {
  this.setState({ hideDialog: false});
        };

this.state = {
...this.state,
conferenceDetails: [],
generateRoomnames:
interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE,
selectedTab: 0,
hideDialog: false
};
this.updateState = this.updateState.bind(this)
/**
* The HTML Element used as the container for additional content. Used
* for directly appending the additional content template to the dom.
*
* @private
* @type {HTMLTemplateElement|null}
*/
this._additionalContentRef = null;

this._roomInputRef = null;

/**
* The HTML Element used as the container for additional toolbar content. Used
* for directly appending the additional content template to the dom.
*
* @private
* @type {HTMLTemplateElement|null}
*/
this._additionalToolbarContentRef = null;

this._additionalCardRef = null;

/**
* The template to use as the additional card displayed near the main one.
*
* @private
* @type {HTMLTemplateElement|null}
*/
this._additionalCardTemplate = document.getElementById(
'welcome-page-additional-card-template');

/**
* The template to use as the main content for the welcome page. If
* not found then only the welcome page head will display.
*
* @private
* @type {HTMLTemplateElement|null}
*/
this._additionalContentTemplate = document.getElementById(
'welcome-page-additional-content-template');

/**
* The template to use as the additional content for the welcome page header toolbar.
* If not found then only the settings icon will be displayed.
*
* @private
* @type {HTMLTemplateElement|null}
*/
this._additionalToolbarContentTemplate = document.getElementById(
'settings-toolbar-additional-content-template'
);

// Bind event handlers so they are only bound once per instance.
this._onFormSubmit = this._onFormSubmit.bind(this);
this._onRoomChange = this._onRoomChange.bind(this);
this._setAdditionalCardRef = this._setAdditionalCardRef.bind(this);
this._setAdditionalContentRef
= this._setAdditionalContentRef.bind(this);
this._setRoomInputRef = this._setRoomInputRef.bind(this);
this._setAdditionalToolbarContentRef
= this._setAdditionalToolbarContentRef.bind(this);
this._onTabSelected = this._onTabSelected.bind(this);
this._renderFooter = this._renderFooter.bind(this);
}

/**
* Implements React's {@link Component#componentDidMount()}. Invoked
* immediately after this component is mounted.
*
* @inheritdoc
* @returns {void}
*/

componentDidMount() {
super.componentDidMount();

document.body.classList.add('welcome-page');
document.title = interfaceConfig.APP_NAME;

if (this.state.generateRoomnames) {
this._updateRoomname();
}

if (this._shouldShowAdditionalContent()) {
this._additionalContentRef.appendChild(
this._additionalContentTemplate.content.cloneNode(true));
}

if (this._shouldShowAdditionalToolbarContent()) {
this._additionalToolbarContentRef.appendChild(
this._additionalToolbarContentTemplate.content.cloneNode(true)
);
}

if (this._shouldShowAdditionalCard()) {
this._additionalCardRef.appendChild(
this._additionalCardTemplate.content.cloneNode(true)
);
}
fetch(CONFERENCES_PARTICIPANTS_COUNT_URL,{
mode: 'no-cors' 
})
.then((response) => {
return response.json();
})
.then((data) => {
this.setState({ conferenceDetails: data });
console.log("conferenceDetails: ",this.state.data);
})
.catch((error) => this.setState({ error, isLoading: false }));
}

/**
* Removes the classname used for custom styling of the welcome page.
*
* @inheritdoc
* @returns {void}
*/
componentWillUnmount() {
super.componentWillUnmount();

document.body.classList.remove('welcome-page');
}

/**
* Implements React's {@link Component#render()}.
*
* @inheritdoc
* @returns {ReactElement|null}
*/
updateState(){
  console.log("hello from handeclick open");
  this.setState({ hideDialog: true });
 console.log(this.state.hideDialog);
 }
handleJoin(){
  //this._onJoin();
    _onFormSubmit(this);
}
render() {
  console.log(this.state.hideDialog);
const { _moderatedRoomServiceUrl, t } = this.props;
const { DEFAULT_WELCOME_PAGE_LOGO_URL, DISPLAY_WELCOME_FOOTER } = interfaceConfig;
const showAdditionalCard = this._shouldShowAdditionalCard();
const showAdditionalContent = this._shouldShowAdditionalContent();
const showAdditionalToolbarContent = this._shouldShowAdditionalToolbarContent();
const contentClassName = showAdditionalContent ? 'with-content' : 'without-content';
const footerClassName = DISPLAY_WELCOME_FOOTER ? 'with-footer' : 'without-footer';
return (
<div>
<div className="site-mobile-menu site-navbar-target">
      <div className="site-mobile-menu-header">
        <div className="site-mobile-menu-close mt-3">
          <span className="icon-close2 js-menu-toggle"></span>
        </div>
      </div>
      <div className="site-mobile-menu-body"></div>
    </div>
<header className="navbar-nav navbar-light bg-light border-bottom" role="banner">
        <nav className="navbar navbar-expand-lg">
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav me-auto mt-0 my-lg-0">
                   <a style={{marginLeft:'2px'}}className="navbar-brand" href="#">
                   <img src='./images/logo1.png' alt="Logo"
                    style={{width:'170',height:'50'}}
                    className="img-fluid"/></a>
                </ul>
	              <div className="navbar-text align-middle">
      			     
				         <a type="button" onClick={this.updateState} style={{fontFamily:'Arial',fontSize:'14px',height:'40px'}} className="text-decoration-none btn-sm btn btn-primary text-white align-center" href="#">JOIN MEETING</a>
                 

                 <a style={{marginLeft:'10px',fontFamily:'Arial',fontSize:'14px',height:'40px'}} type="button"   className="text-decoration-none  btn btn-primary text-white align-center" href="#">
                  CREATE MEETING ROOM
                 </a>
				         
                 <a style={{marginLeft:'12px'}} className="text-primary text-decoration-none" href="#">
                      
                      <SettingsButton 
                            defaultTab = { SETTINGS_TABS.CALENDAR } />
                        { showAdditionalToolbarContent
                            ? <div
                                className = 'settings-toolbar-content'
                                ref = { this._setAdditionalToolbarContentRef } />
                            : null
                        } 
                        
                        
                        </a>
                      

                  <a style={{marginRight:'4px'}} className="text-primary text-decoration-none" href="https://sangoshthee.cdac.in/static/help.html">
                      <HelpOutlineIcon style={{fontSize:'26px'}}/>  </a>
				         
                </div>
            </div>
        </nav>






<img src="./images/Sangoshthee20.jpeg" className="d-block w-100 image-fluid" alt="Banner-1"/>
					
					
			 
  




  </header>




    

<Dialog open={this.state.hideDialog} onClose={this.dialogClose}>
        
       
        <DialogTitle>
       
        
       <h2 style={{color:'rgb(0,122,255)',textAlign:'center',fontFamily:'Arial'}}> Join Meeting </h2></DialogTitle>
        <DialogContent>
          <DialogContentText>
           {/*<span className = 'header-text-subtitle'>
{ t('welcomepage.headerSubtitle')}</span>*/}
<h5 style={{textAlign:'center',fontFamily:'Arial'}}> Secure and high quality meetings </h5>
          </DialogContentText>
          <TextField
            className = 'enter-room-input'
            id = 'enter_room_field'
            aria-disabled = 'false'
            aria-label = 'Meeting name input'
            autoFocus ={false}
            margin="dense"
            id="name"
            label="Enter Meeting ID or Personal Link Name"
            type="text"
            fullWidth
            maxWidth="xl"
            variant="standard"
            onChange = { this._onRoomChange }
            pattern = { ROOM_NAME_VALIDATE_PATTERN_STR }
            placeholder = { this.state.roomPlaceholder }
            ref = { this._setRoomInputRef }
            title = { t('welcomepage.roomNameAllowedChars') }
            value = { this.state.room }
/>
            <DialogContentText>
           By clicking "Join",you agree to our {''}
           
           <a style={{color:'blue'}} className="text-primary text-decoration-none" href="https://sangoshthee.cdac.in/static/help.html">
                  Terms Of Services  </a>
           
          {''}  and {''}
            
             <a style={{color:'blue'}} className="text-primary text-decoration-none" href="https://sangoshthee.cdac.in/static/help.html">
                    Privacy Statement  </a>
          
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.dialogClose}>Cancel</Button>
          <Button 
          aria-disabled = 'false'
aria-label = 'Start meeting'
className = 'welcome-page-button'
id = 'enter_room_button'
onClick= {this._onFormSubmit} >Join </Button>
        </DialogActions>
      </Dialog>
  

{ _moderatedRoomServiceUrl && (
<div id = 'moderated-meetings'>
<p>
{
translateToHTML(
t, 'welcomepage.moderatedMessage', { url: _moderatedRoomServiceUrl })
}
</p>
</div>)}



<section className="site-section bg-light" id="bg-section" >
      <div className=" cta-big-image">
      <div className="container">
        <div className="row mb-5 justify-content-center text-dark">
          <div className="col-md-8 text-center">
			<h2 style={{color:'black'}} className="text-uppercase mb-3"><span className="text-primary">REDEFINE</span> WORKING TOGETHER</h2>
          </div>
        </div>
        <div className="row col-12 mb-12 text-center text-dark">
			    <p>"Effective communication is the lifeblood of organizations, and those efficient and effective communications influence the positive bottom line of organizations in achieving organizational strategic goals.".</p>
         <p>SANGOSHTHEE ensures you to virtually connect one-on-one, lead a secure team meeting, or host an interactive webinar for up to 200 attendees.
        </p>
				</div>    
        </div>  
    </div>
    </section>
	
    <section className="site-section bg-light text-dark" id="sam-section" >
      <div className="container text-justify">
			  <div className="row col-12 mt-5  justify-content-center">
			  
        <div className="row col-12 mb-12">
				      <div className="col-lg-6 col-sm-12 mb-5">
					      <figure>
					      <img src='./images/instant.png' alt="Pic1" 
                className="img-fluid"/>
					      </figure>
				      </div>
				  <div className="col-lg-6 col-sm-12 mt-5 pt-4">            
					<h2 style={{color:'black'}} class="text-uppercase mb-3"><span className="text-primary">SECURITY</span> IS ALWAYS TOP OF MIND</h2>	
					 Because SANGOSHTHEE is built on open standards, it provides secure bussiness continuity. Using WebRTC communications protocols, SANGOSHTHEE provides our valued customers with industry-leading security practices and compliance. With all Sangoshthee audio-video streams  fully encrypted, your meetings are safe and secure.                     
				  </div>
		    </div>
			
      <div className="row col-12 mb-12">
				  <div className="col-lg-6 col-sm-12 mt-5 pt-4">            
					<h2 style={{color:'black'}} className="text-uppercase mb-3">
          <span className="text-primary">HYBRID</span> WORK ENVIRONMENT</h2>	
          Hybrid work environments are the new normal. Sangoshthee makes it easy for employees and agents to seamlessly and consistently operate at home or in the office, across any meeting room, any work environment.
				</div>
				<div class="col-lg-6 col-sm-12 mb-5">
					<figure>
					<img src='./images/planed.png' alt="Pic2" className="img-fluid"/>
					</figure>
				  </div>
		  </div>	
    
    </div>
    </div>
    </section> 

    <section className="site-section bg-primary text-white" id="award-section">
	  	<div className="container">
			  
        <div className="row col-12 mb-5 justify-content-center">
			    <div className="col-md-8 text-center">
				      <h2 style={{color:'white'}} className="mb-3">All the Features You and Your Team Needs!
              </h2>
			    </div>
			  </div>
        
		    <div className="row pt-4 pb-3 text-center">
				  <div className="col-md-3 col-sm-12 mb-5">
         <DescriptionIcon style={{fontSize:'100px'}}/> <h5 style={{color:'white'}}> 
         HD Audio/Video Calling
         </h5> 
          </div>
				
				  <div className="col-md-3 col-sm-12 mb-5">
          <DescriptionIcon style={{fontSize:'100px'}}/>  <h5 style={{color:'white'}}> 
          End-to-End Encryption
          </h5> 
          </div>
				
				  <div className="col-md-3 col-sm-12 mb-5">
          <DescriptionIcon style={{fontSize:'100px'}}/> <h5 style={{color:'white'}}> 
          Virtual Background
          </h5> 
          </div>
				
				  <div className="col-md-3 col-sm-12 mb-5"> 
          <DescriptionIcon style={{fontSize:'100px'}}/><h5 style={{color:'white'}}> 
          Live Streaming to RTMP
          </h5> 
          </div>
				</div>
	    
      </div>	
		</section>
   
    <section className="site-section bg-light text-dark" id="about-section">
      <div className="container">
        <h2 style={{color:'black'}} className="text-uppercase mb-3" >
        <span className="text-dark">Some</span> Recommendations 
        </h2>
	  		  <ul >
			      <li>Use Google Chrome browser  for a better user experience.</li>
			      <li>Keep your microphone and camera muted when possible to avoid extraneous noise and echoing. </li>
			      <li>Headphones with built-in microphones give best performance.</li>
			      <li>Adjust video quality to match your available bandwidth</li>
			      <li>Meeting password is reset when all participants have left the meeting</li>
		      </ul>
      </div>  
    </section>
<div className="site-section bg-light">
    <div className="row pt-2 mt-2 text-center site-footer bg-primary text-white">
          <div className="col-md-12">
            <div className="pt-3">
                <p> &copy; {(new Date().getFullYear())} C-DAC. All rights reserved Designed &amp; Maintained by HPC-I&amp;E, C-DAC Pune<br></br>
					      Version 1.5.1   Date: Oct 25, 2021
                </p>
            </div>
          </div>
    </div> 
</div>








</div>

        );
}

/**
* Renders the insecure room name warning.
*
* @inheritdoc
*/


/**
* Prevents submission of the form and delegates join logic.
*
* @param {Event} event - The HTML Event which details the form submission.
* @private
* @returns {void}
*/
_onFormSubmit(event) {
event.preventDefault();

this._onJoin();

}

/**
* Overrides the super to account for the differences in the argument types
* provided by HTML and React Native text inputs.
*
* @inheritdoc
* @override
* @param {Event} event - The (HTML) Event which details the change such as
* the EventTarget.
* @protected
*/
_onRoomChange(event) {
super._onRoomChange(event.target.value);
}

/**
* Callback invoked when the desired tab to display should be changed.
*
* @param {number} tabIndex - The index of the tab within the array of
* displayed tabs.
* @private
* @returns {void}
*/
_onTabSelected(tabIndex) {
this.setState({ selectedTab: tabIndex });
}

/**
* Renders the footer.
*
* @returns {ReactElement}
*/
_renderFooter() {
const { t } = this.props;
const {
MOBILE_DOWNLOAD_LINK_ANDROID,
MOBILE_DOWNLOAD_LINK_F_DROID,
MOBILE_DOWNLOAD_LINK_IOS
} = interfaceConfig;
const switchShowClass = () => {
// document.getElementById("image").addEventListener('click',show);
const copyright = document.getElementById("copyright");
const recommendations = document.getElementById("display_recommendations");
const copyrights = document.getElementById("display_copyrights");

copyright.classList.toggle("show");
recommendations.classList.toggle("show");
copyrights.classList.toggle("show");

}


}

/**
* Renders tabs to show previous meetings and upcoming calendar events. The
* tabs are purposefully hidden on mobile browsers.
*
* @returns {ReactElement|null}
*/
_renderTabs() {
if (isMobileBrowser()) {
return null;
}

const { _calendarEnabled, _recentListEnabled, t } = this.props;

const tabs = [];

if (_calendarEnabled) {
tabs.push({
label: t('welcomepage.calendar'),
content: <CalendarList />
});
}

if (_recentListEnabled) {
tabs.push({
label: t('welcomepage.recentList'),
content: <RecentList />
});
}

if (tabs.length === 0) {
return null;
}

return (
<Tabs
onSelect = { this._onTabSelected }
selected = { this.state.selectedTab }
tabs = { tabs } />);
}

/**
* Sets the internal reference to the HTMLDivElement used to hold the
* additional card shown near the tabs card.
*
* @param {HTMLDivElement} el - The HTMLElement for the div that is the root
* of the welcome page content.
* @private
* @returns {void}
*/
_setAdditionalCardRef(el) {
this._additionalCardRef = el;
}

/**
* Sets the internal reference to the HTMLDivElement used to hold the
* welcome page content.
*
* @param {HTMLDivElement} el - The HTMLElement for the div that is the root
* of the welcome page content.
* @private
* @returns {void}
*/
_setAdditionalContentRef(el) {
this._additionalContentRef = el;
}

/**
* Sets the internal reference to the HTMLDivElement used to hold the
* toolbar additional content.
*
* @param {HTMLDivElement} el - The HTMLElement for the div that is the root
* of the additional toolbar content.
* @private
* @returns {void}
*/
_setAdditionalToolbarContentRef(el) {
this._additionalToolbarContentRef = el;
}

/**
* Sets the internal reference to the HTMLInputElement used to hold the
* welcome page input room element.
*
* @param {HTMLInputElement} el - The HTMLElement for the input of the room name on the welcome page.
* @private
* @returns {void}
*/
_setRoomInputRef(el) {
this._roomInputRef = el;
}

/**
* Returns whether or not an additional card should be displayed near the tabs.
*
* @private
* @returns {boolean}
*/
_shouldShowAdditionalCard() {
return interfaceConfig.DISPLAY_WELCOME_PAGE_ADDITIONAL_CARD
&& this._additionalCardTemplate
&& this._additionalCardTemplate.content
&& this._additionalCardTemplate.innerHTML.trim();
}

/**
* Returns whether or not additional content should be displayed below
* the welcome page's header for entering a room name.
*
* @private
* @returns {boolean}
*/
_shouldShowAdditionalContent() {
return interfaceConfig.DISPLAY_WELCOME_PAGE_CONTENT
&& this._additionalContentTemplate
&& this._additionalContentTemplate.content
&& this._additionalContentTemplate.innerHTML.trim();
}

/**
* Returns whether or not additional content should be displayed inside
* the header toolbar.
*
* @private
* @returns {boolean}
*/
_shouldShowAdditionalToolbarContent() {
return interfaceConfig.DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT
&& this._additionalToolbarContentTemplate
&& this._additionalToolbarContentTemplate.content
&& this._additionalToolbarContentTemplate.innerHTML.trim();
}
}

export default translate(connect(_mapStateToProps)(WelcomePage));

