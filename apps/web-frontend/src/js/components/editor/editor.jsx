import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import editor from "./edit.scss";
import { selectGardenPhoto } from "../../actions/index";
import { showEditor, editorMode } from "../../actions/index";
import EditorFilter from "./filter/filter"
import ManualEditor from "./manual/manual-editor.component"

const ConnectedEditor = ({ photo, settings, selectGardenPhoto, showEditor, editorMode }) => settings.show && photo ? (
    <section>
        <EditorFilter />
        <ManualEditor />
        <section className="btn-wrapped">
            <button onClick={() => {
                editorMode('FILTER');
            }}>
                Filters
        </button>
            <button onClick={() => {
                editorMode('MANUAL');
            }}>
                Manual
        </button>
        </section >
    </section >
) : photo ? (
    <section>
        <button onClick={() => {
            showEditor(true);
        }}>Edit photo</button>
    </section>
) : null;
ConnectedEditor.propTypes = {
    photo: PropTypes.object,
    settings: PropTypes.object.isRequired,
    selectGardenPhoto: PropTypes.func.isRequired,
    editorMode: PropTypes.func.isRequired
};
const Editor = connect(
    state => {
        return {
            photo: state.selectedPhoto,
            settings: state.editorSettings
        };
    },
    dispatch => {
        return {
            selectGardenPhoto: (photo) => dispatch(selectGardenPhoto(photo)),
            showEditor: (show) => dispatch(showEditor(show)),
            editorMode: (mode) => dispatch(editorMode(mode))
        };
    }
)(ConnectedEditor);

export default Editor;
