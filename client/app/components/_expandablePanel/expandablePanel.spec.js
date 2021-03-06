import ExpandablePanelModule from "./expandablePanel";

const { module } = angular.mock;

describe("ExpandablePanel", () => {
  beforeEach(module(ExpandablePanelModule));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named expandablePanel", () => {
      expect(ExpandablePanelModule).to.equal("expandablePanel");
    });
  });

  describe("Controller", () => {
    let $componentController;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
    }));

    it("renders markdown", () => {
      let $ctrl = $componentController("expandablePanel", { }, { markdown: true });
      $ctrl.$onChanges({
        content: {
          currentValue: "sometext"
        }
      });
      expect($ctrl.parsed).to.equal("<p>sometext</p>\n");
    });

    it("collapses and expands long text", () => {
      let $ctrl = $componentController("expandablePanel", { }, { collapse: 10 });
      $ctrl.$onChanges({
        content: {
          currentValue: new Array(20).join("text\n")
        }
      });
      expect($ctrl.collapsed).to.be.true;
      $ctrl.expand();
      expect($ctrl.collapsed).to.be.false;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      scope.data = "some text\nnew line\nanother line";
      let el = $compile("<expandable-panel content='data' markdown='false' collapse='1'>" +
        "</expandable-panel>")(scope);
      scope.$digest();
      expect(el.html()).to.contain("some text");
      expect(el.html()).to.contain("md-button");
    });
  });
});
