import React from "react";
import AppViews from "./views/AppViews";
import DeployerViews from "./views/DeployerViews";
import AttacherViews from "./views/AttacherViews";
import { renderDOM, renderView } from "./views/render";
import "./index.css";
import * as backend from "./build/index.main.mjs";
import { loadStdlib } from "@reach-sh/stdlib";
const reach = loadStdlib(process.env);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { view: "ConnectAccount", ...defaults };
  }
  async componentDidMount() {
    const acc = await reach.getDefaultAccount();
    const balAtomic = await reach.balanceOf(acc);
    const bal = reach.formatCurrency(balAtomic, 4);
    this.setState({ acc, bal });
    if (await reach.canFundFromFaucet()) {
      this.setState({ view: "FundAccount" });
    } else {
      this.setState({ view: "DeployerOrAttacher" });
    }
  }
  async fundAccount(fundAmount) {
    await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
    this.setState({ view: "DeployerOrAttacher" });
  }
  async skipFundAccount() {
    this.setState({ view: "DeployerOrAttacher" });
  }
  selectAttacher() {
    this.setState({ view: "Wrapper", ContentView: Attacher });
  }
  selectDeployer() {
    this.setState({ view: "Wrapper", ContentView: Company });
  }
  render() {
    return renderView(this, AppViews);
  }
}

class Client extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      appState: "",
      args: [],
      resGetPayment: null,
      resGetSubscriberBalanceBeforePayment: null,
      paymentCount: 0,
      resGetUserRequest: null,
      resGetSubscriberBalanceAfterPayment: null,
      resGetSubscriberLastBalance: null,
    };

    this.getPaymentExt = this.getPaymentExt.bind(this);
    this.getSubscriberBalanceBeforePaymentExt =
      this.getSubscriberBalanceBeforePaymentExt.bind(this);
    this.getUserRequestExt = this.getUserRequestExt.bind(this);
    this.getSubscriberBalanceAfterPaymentExt =
      this.getSubscriberBalanceAfterPaymentExt.bind(this);
    this.getSubscriberLastBalanceExt =
      this.getSubscriberLastBalanceExt.bind(this);
  }
}
class Company extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      appState: "",
      args: [],
      resGetControlBalance: null,
      resApproveUserRequest: null,
      approveRequestArgs: null,
      resGetCompanyLastBalance: null,
    };

    this.getControlBalanceExt = this.getControlBalanceExt.bind(this);
    this.approveUserRequestExt = this.approveUserRequestExt.bind(this);
    this.getInsuranceCompanyBalanceExt =
      this.getInsuranceCompanyBalanceExt.bind(this);
  }

  componentDidMount() {
    const [, , , , , , ctc, , ctcArgs, , ,] = this.context;
    this.interval = setInterval(async () => this.updateBalance(), 10000);
    Backend.InsuranceCompany(ctc[0], this);
  }

  async updateBalance() {
    const [
      account,
      ,
      ,
      setBalance,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      regularPaymentCount,
      setRegularPaymentCount,
    ] = this.context;

    const balance = Reach.formatCurrency(await Reach.balanceOf(account), 4);
    setBalance(balance);
  }

  random() {
    return Reach.hasRandom.random();
  }

  async getControlBalance() {
    const controlBalance = await new Promise((res) => {
      this.setState({
        appState: "getControlBalance",
        resGetControlBalance: res,
      });
    });
    this.setState({
      appState: "",
    });

    return controlBalance;
  }

  getControlBalanceExt(controlBalanceExt) {
    const amt = Reach.parseCurrency(controlBalanceExt);
    this.state.resGetControlBalance(amt);
  }

  async informTimeout() {
    this.setState({
      appState: "informTimeout",
    });
  }

  async seeOutcome(outcome) {
    const outcomeNumber = Reach.bigNumberToNumber(outcome);
    this.setState({
      appState: "seeOutcome",
      args: [outcomeNumber],
    });
  }

  async approveUserRequest(balance, isUserRequsted, userRequestedPayment) {
    var requestedObj = new Object();
    requestedObj.isRequested = isUserRequsted;
    requestedObj.balance = Reach.bigNumberToNumber(balance);
    requestedObj.userRequestedPayment =
      Reach.bigNumberToNumber(userRequestedPayment);

    const isApproved = await new Promise((res) => {
      this.setState({
        appState: "approveUserRequest",
        resApproveUserRequest: res,
        approveRequestArgs: requestedObj,
      });
    });

    this.setState({
      appState: "",
    });

    return isApproved;
  }
  approveUserRequestExt(isApproved) {
    this.state.resApproveUserRequest(isApproved);
  }

  async getInsuranceCompanyBalance() {
    const lastBalanceOfCompany = await new Promise((res) => {
      this.setState({
        appState: "getInsuranceCompanyBalance",
        resGetCompanyLastBalance: res,
      });
    });
    this.setState({
      appState: "finishedState",
    });
    return lastBalanceOfCompany;
  }

  getInsuranceCompanyBalanceExt(companyLastBalance) {
    this.state.resGetCompanyLastBalance(companyLastBalance);
  }

  render() {
    return (
      <InsuranceCompanyViews
        appState={this.state.appState}
        args={this.state.args}
        getControlBalanceReady={this.state.resGetControlBalance !== null}
        getControlBalance={this.getControlBalanceExt}
        approveRequestReady={this.state.resApproveUserRequest !== null}
        approveRequest={this.approveUserRequestExt}
        approveRequestArgs={this.state.approveRequestArgs}
        getCompanyBalanceReady={this.state.resGetCompanyLastBalance !== null}
        getInsuranceCompanyBalance={this.getInsuranceCompanyBalanceExt}
      />
    );
  }
}
class Attacher extends Client {
  constructor(props) {
    super(props);
    this.state = { view: "Attach" };
  }
  attach(ctcInfoStr) {
    const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
    this.setState({ view: "Attaching" });
    backend.Bob(ctc, this);
  }
  async acceptWager(wagerAtomic) {
    // Fun([UInt], Null)
    const wager = reach.formatCurrency(wagerAtomic, 4);
    return await new Promise((resolveAcceptedP) => {
      this.setState({ view: "AcceptTerms", wager, resolveAcceptedP });
    });
  }
  termsAccepted() {
    this.state.resolveAcceptedP();
    this.setState({ view: "WaitingForTurn" });
  }
  render() {
    return renderView(this, AttacherViews);
  }
}

renderDOM(<App />);
