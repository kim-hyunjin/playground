import { CommonDialog } from "../src/common/dialog";
import { Contents } from "../src/common/models/contents";

describe("dialog test", () => {
    let dialog1: CommonDialog;
    beforeEach(() => {
        dialog1 = new CommonDialog("예제1", {
            contents: [
                {
                    label: "이름",
                    text: "김현진",
                    editable: false,
                },
                {
                    label: "나이",
                    text: "30",
                    editable: false,
                },
                {
                    label: "이메일",
                    text: "hyunjin1612@gmail.com",
                },
                {
                    label: "자기소개",
                },
            ],
        });
    });

    test("dialog open callback function test", (done) => {
        function callback() {
            try {
                done();
            } catch (err) {
                done(err);
            }
        }

        dialog1.on("onOpen", callback);
        dialog1.open();
    });

    test("dialog close callback function test", (done) => {
        function callback() {
            try {
                done();
            } catch (err) {
                done(err);
            }
        }

        dialog1.on("onClose", callback);
        dialog1.close();
    });

    test("dialog editable callback function test", (done) => {
        function callback() {
            try {
                done();
            } catch (err) {
                done(err);
            }
        }

        dialog1.on("onEdit", callback);
        const editable = dialog1.editable(true);
        expect(editable).toEqual(true);
    });

    test("dialog cancel callback function test", (done) => {
        function callback() {
            try {
                done();
            } catch (err) {
                done(err);
            }
        }

        dialog1.on("onCancel", callback);
        dialog1.cancel();
    });

    test("dialog save callback function test", (done) => {
        function callback() {
            try {
                done();
            } catch (err) {
                done(err);
            }
        }

        dialog1.on("onSave", callback);
        dialog1.save();
    });

    test("dialog changeTitle function test", () => {
        const expected = "test title";
        dialog1.changeTitle(expected);

        expect(dialog1.getDataSource().title).toEqual(expected);
    });

    test("dialog setDataSource function test", () => {
        const expected: Contents = {
            label: "test label",
            text: "1234567890",
            editable: false,
        };

        dialog1.setDataSource({ contents: [expected] });

        expect(dialog1.getDataSource().contents[0]).toEqual(expected);
    });
});
