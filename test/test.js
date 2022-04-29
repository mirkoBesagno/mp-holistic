


describe('test-and', function () {
  it('-1', function (done) {
    try {
        console.log('terst 1');
        done();
    } catch (error) {
      console.log(error);
      done(new Error("Errore!"));
    }
  });
});
