const sorting = require("../../app");

describe("Books names test suit", () => {
  it("Books names should be sorted in ascending order", () => {
    expect(
      sorting.sortByName([
        "Гарри Поттер",
        "Властелин Колец",
        "Волшебник изумрудного города",
      ])
    ).toEqual([
      "Властелин Колец",
      "Волшебник изумрудного города",
      "Гарри Поттер",
    ]);
  });
  it("Ignore case when sorting", () => {
    expect(
      sorting.sortByName([
        "Властелин Колец",
        "ВЛАСТЕЛИН КОЛЕЦ"
      ])
    )
    .toEqual([
      "Властелин Колец",
      "ВЛАСТЕЛИН КОЛЕЦ"
    ])
  });
});
