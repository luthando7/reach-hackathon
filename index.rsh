"reach 0.1";

export const main = Reach.App(
  {},
  [ Participant("Subscriber", {
    request: Fun([UInt], UInt),
    getUserRequest: Fun(
      [UInt],
      Object({ isRequested: Bool, requestedPayment: UInt })
    ),
    getSubscriberBalanceAfterPayment: Fun([], UInt),
    showValue: Fun([UInt], Null),
    showPaymentCount: Fun([UInt], Null),
    getPayment: Fun([], UInt),
    getSubscriberBalanceBeforePayment: Fun([], UInt),
    getSubscriberLastBalance: Fun([], UInt),
  }), 
  Participant("InsuranceCompany", {
    getBalance: Fun([], UInt),
    approve: Fun([UInt, UInt], Bool),
    showValue: Fun([UInt], Null),
    getCompanyBalance: Fun([], UInt),
    approveRequest: Fun([UInt, Bool, UInt], Bool),
  })],

  (Subscriber, InsuranceCompany) => {
    Subscriber.publish();
    commit();

    const canf = 2;

    InsuranceCompany.only(() => {
      const getBalance = declassify(interact.getBalance());
      assume(getBalance > 0);
    });
    InsuranceCompany.publish(getBalance);
    commit();

    Subscriber.only(() => {
      const howMuch = declassify(interact.getPayment());
      assume(howMuch > 0);
      assume(getBalance > howMuch);
    });
    Subscriber.publish(howMuch);
    commit();
    Subscriber.publish();

    var [bal, usgVal, paymentCount] = [0, 0, 0];
    invariant(bal == 0);
    while (usgVal == 0) {
      commit();

      Subscriber.only(() => {
        interact.showPaymentCount(paymentCount + 1);
      });

      Subscriber.only(() => {
        const tempBalanceofSubscriber0 = declassify(
          interact.getSubscriberBalanceBeforePayment()
        );
      });

      Subscriber.publish(tempBalanceofSubscriber0);

      commit();

      wait(canf);

      Subscriber.pay(howMuch);
      commit();

      Subscriber.only(() => {
        const { isRequested, requestedPayment } = declassify(
          interact.getUserRequest(balance())
        );
        assume(requestedPayment <= balance());
      });
      Subscriber.publish(isRequested, requestedPayment);
      require(requestedPayment <= balance());
      commit();

      InsuranceCompany.only(() => {
        const result = declassify(
          interact.approveRequest(balance(), isRequested, requestedPayment)
        );
      });
      InsuranceCompany.publish(result);

      commit();
      Subscriber.only(() => {
        const tempBalanceofSubscriber = declassify(
          interact.getSubscriberBalanceAfterPayment()
        );
      });

      Subscriber.publish(tempBalanceofSubscriber);

      if (tempBalanceofSubscriber >= getBalance) {
        if (result) {
          transfer(requestedPayment).to(Subscriber);
        }
        [bal, usgVal, paymentCount] = [bal, 0, paymentCount + 1];
        continue;
      } else {
        [bal, usgVal, paymentCount] = [bal, 1, paymentCount];
        continue;
      }
    }

    commit();
    Subscriber.only(() => {
      const tempBalanceofSubscriberX = declassify(
        interact.getSubscriberLastBalance()
      );
    });
    Subscriber.publish(tempBalanceofSubscriberX);
    transfer(balance()).to(InsuranceCompany);
    commit();

    InsuranceCompany.only(() => {
      const tempBalanceofInsuranceCompanyY = declassify(
        interact.getCompanyBalance()
      );
    });
    InsuranceCompany.publish(tempBalanceofInsuranceCompanyY);

    commit();
  }
);
