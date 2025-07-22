import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../widgets/footer/footer';
import { Header } from '../widgets/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
