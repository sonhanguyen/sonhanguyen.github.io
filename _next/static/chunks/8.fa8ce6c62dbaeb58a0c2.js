(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{xEgi:function(e,t,n){"use strict";n.r(t),n.d(t,"title",(function(){return p})),n.d(t,"default",(function(){return l}));var r=n("i7BK"),c=n("ZLgk"),o=n("Jn/6"),a=n.n(o),b=n("X7W7"),p=(a.a.createElement,"How to useReducer"),u={title:p},s="wrapper";function l(e){var t=e.components,n=Object(c.a)(e,["components"]);return Object(b.b)(s,Object(r.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(b.b)("p",null,"we first start with "),Object(b.b)("pre",null,Object(b.b)("code",Object(r.a)({parentName:"pre"},{}),"type SavedCreditCard = { cardNumber: string, cvv: string }\n\ntype State = Partial<SavedCreditCard> & {\n  newCCFormIsShown: boolean\n}\n")),Object(b.b)("p",null,"enum ActionType { ToggleNewCCForm, SelectSaved }\nconst toggleNewCCForm = () =>\n({ type: ActionType.ToggleNewCCForm } as const)\nconst selectCardNumber = (cardNumber: string) =>\n({ type: ActionType.SelectSaved, cardNumber } as const)"),Object(b.b)("p",null,"type Action = ReturnType<\n| typeof toggleNewCCForm\n| typeof selectCardNumber"),Object(b.b)("blockquote",null),Object(b.b)("p",null,"const reducer = (state: State, action: Action) => {\nswitch (action.type) {\ncase ActionType.ToggleNewCCForm: return {\n...state,\nnewCCFormIsShown: !state.newCCFormIsShown\n}"),Object(b.b)("pre",null,Object(b.b)("code",Object(r.a)({parentName:"pre"},{}),"case ActionType.SelectSaved: return {\n  ...state,\n  cardNumber: action.cardNumber\n}\n\ndefault: return state\n")),Object(b.b)("p",null,"  }\n}"))}l.isMDXComponent=!0}}]);