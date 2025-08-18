import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Comment } from '../../features/comments/model/comment.interface';

@Component({
  selector: 'app-comment',
  imports: [DatePipe],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
})
export class CommentComponent {
  comment = input.required<Comment>();
}
