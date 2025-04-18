import { Component, Inject } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-question-dialog',
  templateUrl: './add-question-dialog.component.html',
  styleUrls: ['./add-question-dialog.component.css'],
})
export class AddQuestionDialogComponent {
  questionForm: FormGroup;
  questionTypes = ['Single Select', 'Multiple Choice', 'Text', 'Rating'];
  selectedQuestionType: string = 'Single Select';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { surveyId: string; surveyName: string }
  ) {
    this.questionForm = this.fb.group({
      questions: this.fb.array([this.createQuestion()]),
    });
  }

  get questions(): FormArray {
    return this.questionForm.get('questions') as FormArray;
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      questionText: ['', Validators.required],
      rating: [0], // Default rating set to 0
    });
  }

  addQuestion(): void {
    this.questions.push(this.createQuestion());
  }

  removeQuestion(index: number): void {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    }
  }

  selectQuestionType(type: string): void {
    this.selectedQuestionType = type;
  }

  setRating(questionIndex: number, rating: number): void {
    this.questions.at(questionIndex).get('rating')?.setValue(rating);
  }

  submit(): void {
    if (this.questionForm.valid) {
      this.dialogRef.close(this.questionForm.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
