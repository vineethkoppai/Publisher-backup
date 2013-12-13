//META DATA USED BY CREATE DLA VIEW TO RENDER THE FORM
define(['views/createDLA/teachersEvaluation'],
function(View) {

var formModel =  {
    "response": {
        "operation-status": "SUCCESS",
        "content-type": {
            "name": "DLA",
            "id": 21,
            "meta-attribute-description-list": [
                {
                    "id": 41,
                    "name": "activity",
                    "options": [
                        "Play",
                        "Practice",
                        "Explore",
                        "Create",
                        "Watch"
                    ],
                    "is-multivalued": true,
                    "is-restricted": true
                },
                {
                    "id": 42,
                    "name": "difficulty",
                    "options": [
                        "No Levels",
                        "Can Choose a Level",
                        "Automatically Progresses"
                    ],
                    "is-multivalued": false,
                    "is-restricted": true
                },
                {
                    "id": 43,
                    "name": "Blooms",
                    "options": [
                        "Remembering",
                        "Understanding",
                        "Applying",
                        "Analysing",
                        "Evaluating",
                        "Creating"
                    ],
                    "is-multivalued": false,
                    "is-restricted": true
                },
                {
                    "id": 44,
                    "name": "language",
                    "options": [
                        "English",
                        "Spanish",
                        "Other"
                    ],
                    "is-multivalued": true,
                    "is-restricted": true
                },
                {
                    "id": 45,
                    "name": "restrictions",
                    "options": [
                        "None",
                        "Download Required",
                        "Account Required"
                    ],
                    "is-multivalued": true,
                    "is-restricted": true
                },
                {
                    "id": 46,
                    "name": "plugin",
                    "options": [
                        "Flash",
                        "Java",
                        "Shockwave",
                        "Silverlight",
                        "Quicktime",
                        "PdfViewer",
                        "Other",
                        "None"
                    ],
                    "is-multivalued": true,
                    "is-restricted": true
                },
                {
                    "id": 47,
                    "name": "audio-support",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 48,
                    "name": "acct-required",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 49,
                    "name": "multi-player",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 50,
                    "name": "teaches-content",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 51,
                    "name": "thumbnailURL",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 52,
                    "name": "min-grade",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 53,
                    "name": "max-grade",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 54,
                    "name": "student-instructions",
                    "is-multivalued": true,
                    "is-restricted": false
                },
                {
                    "id": 55,
                    "name": "comments",
                    "is-multivalued": true,
                    "is-restricted": false
                },
                {
                    "id": 56,
                    "name": "what-students-do",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 57,
                    "name": "subject",
                    "is-multivalued": true,
                    "is-restricted": false
                },
                {
                    "id": 58,
                    "name": "subtopic",
                    "is-multivalued": true,
                    "is-restricted": false
                },
                {
                    "id": 59,
                    "name": "source-type",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 60,
                    "name": "source-id",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 61,
                    "name": "source-site",
                    "is-multivalued": false,
                    "is-restricted": false
                },
                {
                    "id": 62,
                    "name": "subject-mapping",
                    "is-multivalued": true,
                    "is-restricted": false
                },
                {
                    "id": 63,
                    "name": "feedback",
                    "options": [
                        "None",
                        "Gives hints",
                        "Marks right or wrong",
                        "Gives score",
                        "Gives explanations",
                        "Includes quiz"
                    ],
                    "is-multivalued": true,
                    "is-restricted": true
                }
            ],
            "subject-list": [
                {
                    "id": 1,
                    "name": "Math",
                    "taxonomyId": 4,
                    "subtopics": null
                },
                {
                    "id": 2,
                    "name": "Language Arts",
                    "taxonomyId": 3,
                    "subtopics": null
                },
                {
                    "id": 3,
                    "name": "Science",
                    "taxonomyId": 0,
                    "subtopics": null
                },
                {
                    "id": 4,
                    "name": "Social Studies",
                    "taxonomyId": 0,
                    "subtopics": null
                },
                {
                    "id": 5,
                    "name": "Art",
                    "taxonomyId": 0,
                    "subtopics": null
                },
                {
                    "id": 6,
                    "name": "Technology",
                    "taxonomyId": 0,
                    "subtopics": null
                },
                {
                    "id": 7,
                    "name": "World Languages",
                    "taxonomyId": 0,
                    "subtopics": null
                },
                {
                    "id": 8,
                    "name": "Brain Games",
                    "taxonomyId": 0,
                    "subtopics": null
                },
                {
                    "id": 9,
                    "name": "Your Life",
                    "taxonomyId": 0,
                    "subtopics": null
                }
            ]
        }
    }
}


return formModel;

});